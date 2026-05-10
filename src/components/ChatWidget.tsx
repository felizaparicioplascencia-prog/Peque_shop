import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { COMPUTER_PRODUCTS } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  id: 1,
  role: "assistant",
  content:
    "¡Qué tal! 👋 Soy **Robotic**, tu Ingeniero en Sistemas de PEQUE_SHOP (Jalisco, MX).\n\nPuedo ayudarte con:\n- 🖥️ Recomendaciones de PCs (Gaming, Oficina, Edición)\n- 📸 Cámaras GoPro y de acción\n- 🔧 Diagnóstico de problemas de hardware\n\n¿En qué te ayudo hoy?",
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ia`;

const buildCatalog = () =>
  COMPUTER_PRODUCTS.map((p) => ({
    nombre: p.nombre,
    categoria: p.categoria,
    precio: p.precio,
    descripcion: p.descripcion,
  }));

const ChatWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!user) {
        setMessages([WELCOME]);
        return;
      }
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id, role, content, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) {
        console.error("Error cargando historial:", error);
        setMessages([WELCOME]);
        return;
      }
      if (!data || data.length === 0) {
        setMessages([WELCOME]);
      } else {
        setMessages(
          data.map((m, i) => ({
            id: i + 1,
            role: m.role as "user" | "assistant",
            content: m.content,
          }))
        );
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, isTyping]);

  const persist = async (role: "user" | "assistant", content: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("chat_messages")
      .insert({ user_id: user.id, role, content });
    if (error) console.error("Error guardando mensaje:", error);
  };

  const clearHistory = async () => {
    if (user) {
      const { error } = await supabase.from("chat_messages").delete().eq("user_id", user.id);
      if (error) {
        toast({ title: "Error", description: "No pude borrar el historial.", variant: "destructive" });
        return;
      }
    }
    setMessages([WELCOME]);
    toast({ title: "Historial borrado" });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setIsTyping(true);
    persist("user", text);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          catalog: buildCatalog(),
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({ title: "Demasiadas solicitudes", description: "Intenta en un momento.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "Créditos agotados", description: "Agrega saldo de IA en tu workspace.", variant: "destructive" });
        } else {
          toast({ title: "Error", description: "No pude conectar con Robotic.", variant: "destructive" });
        }
        setIsTyping(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";
      const assistantId = Date.now() + 1;
      let createdAssistant = false;
      let streamDone = false;

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        if (!createdAssistant) {
          createdAssistant = true;
          setIsTyping(false);
          setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: assistantSoFar }]);
        } else {
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: assistantSoFar } : m))
          );
        }
      };

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let nlIdx: number;
        while ((nlIdx = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, nlIdx);
          textBuffer = textBuffer.slice(nlIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsert(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsert(content);
          } catch {
            /* ignore */
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      toast({ title: "Error", description: "Falló la comunicación con Robotic.", variant: "destructive" });
    } finally {
      setIsTyping(false);
      if (assistantSoFar) persist("assistant", assistantSoFar);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir chat de Robotic"
          className="fixed bottom-6 right-6 z-50 group"
        >
          <span className="absolute inset-0 rounded-full bg-[hsl(var(--chat-orange))] opacity-40 blur-xl animate-pulse" />
          <span className="relative w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-[hsl(var(--chat-orange))] to-[hsl(22_95%_45%)] text-white shadow-2xl hover:scale-110 transition-transform duration-300 ring-2 ring-[hsl(var(--chat-bg))]">
            <MessageCircle className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-[hsl(var(--chat-bg))]" />
          </span>
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-3rem)] rounded-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300 border border-[hsl(var(--chat-border))]"
          style={{ background: "var(--chat-gradient)", boxShadow: "var(--chat-glow)" }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-[hsl(var(--chat-border))] bg-[hsl(var(--chat-surface))]/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--chat-orange))] to-[hsl(22_95%_45%)] flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[hsl(var(--chat-surface))]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[hsl(var(--chat-text))] flex items-center gap-1.5">
                  Robotic
                  <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--chat-orange))]" />
                </p>
                <p className="text-xs text-[hsl(var(--chat-muted))]">Ingeniero en Sistemas · Jalisco</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              className="text-[hsl(var(--chat-muted))] hover:text-[hsl(var(--chat-orange))] transition-colors p-1.5 rounded-lg hover:bg-[hsl(var(--chat-surface-2))]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-4">
            <div ref={scrollRef} className="flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--chat-orange))] to-[hsl(22_95%_45%)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-md ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-[hsl(var(--chat-orange))] to-[hsl(22_95%_45%)] text-white rounded-tr-sm"
                        : "bg-[hsl(var(--chat-bot-bubble))] text-[hsl(var(--chat-text))] rounded-tl-sm border border-[hsl(var(--chat-border))]"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-strong:text-[hsl(var(--chat-orange-soft))]">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--chat-surface-2))] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[hsl(var(--chat-border))]">
                      <User className="w-4 h-4 text-[hsl(var(--chat-muted))]" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--chat-orange))] to-[hsl(22_95%_45%)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-[hsl(var(--chat-bot-bubble))] border border-[hsl(var(--chat-border))] rounded-2xl rounded-tl-sm px-4 py-3 shadow-md">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-[hsl(var(--chat-muted))] mr-1">Escribiendo</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--chat-orange))] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--chat-orange))] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--chat-orange))] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-[hsl(var(--chat-border))] bg-[hsl(var(--chat-surface))]/80 backdrop-blur flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a Robotic..."
              disabled={isTyping}
              className="flex-1 bg-[hsl(var(--chat-surface-2))] border-[hsl(var(--chat-border))] text-[hsl(var(--chat-text))] placeholder:text-[hsl(var(--chat-muted))] focus-visible:ring-[hsl(var(--chat-orange))] focus-visible:ring-offset-0"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Enviar mensaje"
              className="w-10 h-10 rounded-md bg-gradient-to-br from-[hsl(var(--chat-orange))] to-[hsl(22_95%_45%)] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
