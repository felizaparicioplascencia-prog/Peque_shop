import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  role: "user" | "bot";
  content: string;
}

const getBotResponse = (text: string): string => {
  const t = text.toLowerCase().trim();

  if (/(hola|buenas|saludos|hey|qué tal|que tal)/.test(t)) {
    return "¡Hola! 👋 Soy Robotic, el asistente virtual de PEQUE_SHOP. Puedo ayudarte con dudas sobre cámaras GoPro y computadoras. ¿En qué te ayudo?";
  }
  if (/(precio|costo|cuanto cuesta|cuánto cuesta|vale|valor)/.test(t)) {
    if (t.includes("gopro") || t.includes("cámara") || t.includes("camara")) {
      return "📸 Las cámaras GoPro en nuestro catálogo van desde $299 (modelos básicos) hasta $549 (HERO12 Black). Visita /productos para ver el catálogo completo.";
    }
    if (t.includes("pc") || t.includes("computadora") || t.includes("desktop")) {
      return "💻 Las computadoras de escritorio van desde $599 (oficina) hasta $2,499 (gamer high-end). También puedes armar tu PC personalizada en /servicios/armar-pc.";
    }
    return "💰 Tenemos productos para todos los presupuestos: GoPro desde $299 y computadoras desde $599. ¿Sobre qué producto te gustaría saber más?";
  }
  if (/(gopro|cámara de acción|camara de accion|action cam)/.test(t)) {
    return "📸 Manejamos toda la línea GoPro: HERO11, HERO12 Black, MAX 360 y accesorios. Son ideales para deportes extremos, vlogging y aventuras. ¿Quieres saber sobre algún modelo en particular?";
  }
  if (/(computadora|pc|desktop|gamer|gaming|escritorio)/.test(t)) {
    return "💻 Tenemos computadoras de escritorio para oficina, diseño y gaming. Además puedes armar tu propia PC eligiendo cada componente en la sección 'Arma tu PC'. ¿Buscas algo específico?";
  }
  if (/(armar|configurar|build)/.test(t)) {
    return "🔧 ¡Ofrecemos un configurador de PC! Entra a /servicios/armar-pc, elige procesador, GPU, RAM, etc., y agregamos la build a tu carrito. También tenemos cursos de armado.";
  }
  if (/(curso|aprender|enseñar|ensenar)/.test(t)) {
    return "🎓 Tenemos 3 cursos de armado de PC: Básico ($99), Intermedio ($199) y Pro ($349). Inscríbete desde /servicios/armar-pc.";
  }
  if (/(envio|envío|entrega|shipping)/.test(t)) {
    return "🚚 Realizamos envíos a todo el país. El tiempo estimado es de 3 a 7 días hábiles según tu ubicación.";
  }
  if (/(pago|tarjeta|métodos|metodos|paypal)/.test(t)) {
    return "💳 Aceptamos tarjetas de crédito/débito, transferencias y pagos en línea. El proceso es seguro y rápido.";
  }
  if (/(garantía|garantia|devolución|devolucion|cambio)/.test(t)) {
    return "✅ Todos nuestros productos cuentan con garantía del fabricante (mínimo 1 año). Aceptamos cambios dentro de los primeros 15 días.";
  }
  if (/(contacto|ayuda|soporte|hablar|asesor)/.test(t)) {
    return "📩 Puedes escribirnos a peque_shop@gmail.com y un asesor te atenderá lo antes posible.";
  }
  if (/(gracias|thank)/.test(t)) {
    return "¡Con gusto! 😊 Si tienes otra duda, aquí estoy.";
  }
  if (/(adios|adiós|bye|chao)/.test(t)) {
    return "¡Hasta pronto! 👋 Que tengas un excelente día.";
  }

  return "🤔 No estoy seguro de entender. Puedes preguntarme sobre: precios, cámaras GoPro, computadoras, armar tu PC, cursos, envíos, métodos de pago o garantías.";
};

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      content: "¡Hola! 👋 Soy Robotic, el asistente de PEQUE_SHOP. Pregúntame sobre cámaras GoPro o computadoras.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        role: "bot",
        content: getBotResponse(text),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir chat de ayuda"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold hover:bg-gold-light text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[calc(100vh-3rem)] bg-background border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between border-b border-gold/20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold">Robotic</p>
                <p className="text-xs text-primary-foreground/60 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                  En línea
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat"
              className="text-primary-foreground/70 hover:text-gold transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div ref={scrollRef} className="flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-gold" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-border bg-background flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="hero" disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
