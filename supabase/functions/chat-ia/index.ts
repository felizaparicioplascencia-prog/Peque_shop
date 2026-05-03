// Edge function: chat-ia
// Asistente Robotic con Lovable AI Gateway (Gemini) + catálogo de productos

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface CatalogItem {
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
}

const SYSTEM_PROMPT = `Eres "Robotic", Ingeniero experto en Sistemas Computacionales y soporte técnico ubicado en Jalisco, México, trabajando para la tienda PEQUE_SHOP.

Tu especialidad es la venta y diagnóstico de:
- Computadoras de escritorio
- Laptops
- Cámaras GoPro y de acción
- Componentes y periféricos

Reglas de comunicación:
- Lenguaje profesional pero accesible y cercano (puedes usar modismos suaves de México).
- Respuestas claras, en formato Markdown cuando ayude (listas, **negritas**).
- Mantén respuestas concisas (máx 5-7 líneas) salvo que el usuario pida detalle.

Reglas de venta y soporte:
1. Si preguntan por una PC, primero pregunta su uso (Gaming, Oficina, Edición de video/foto, Estudio) y recomienda componentes acordes (CPU, GPU, RAM, almacenamiento) usando productos del catálogo cuando aplique.
2. Si preguntan por cámaras, destaca la **durabilidad**, resistencia al agua, estabilización HyperSmooth y versatilidad de las **GoPro**.
3. **Antes de sugerir una compra nueva**, intenta ayudar al usuario a resolver problemas técnicos de hardware (preguntas de diagnóstico: ¿enciende?, ¿hace ruido?, ¿hace cuánto pasa?, ¿qué cambió recientemente?, etc.).
4. Cuando recomiendes un producto del catálogo, menciona su **nombre exacto y precio en USD**.
5. Si el usuario pregunta por algo fuera de tu ámbito (cocina, política, etc.), redirígelo amablemente a temas de cómputo y cámaras.

Servicios de PEQUE_SHOP que puedes mencionar:
- Configurador "Arma tu PC" en /servicios/armar-pc
- Cursos de armado de PC: Básico ($99), Intermedio ($199), Pro ($349)
- Envíos a todo México (3-7 días hábiles)
- Garantía mínima 1 año, cambios dentro de 15 días
- Contacto: peque_shop@gmail.com`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY no configurada" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const messages = body.messages as Array<{ role: string; content: string }>;
    const catalog = (body.catalog ?? []) as CatalogItem[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages requerido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convertir el catálogo a un bloque de contexto compacto
    const catalogText = catalog.length
      ? "CATÁLOGO ACTUAL DE PEQUE_SHOP (usa estos nombres y precios exactos):\n" +
        catalog
          .map(
            (p) =>
              `- [${p.categoria}] ${p.nombre} — $${p.precio} USD — ${p.descripcion}`
          )
          .join("\n")
      : "";

    const systemContent = catalogText
      ? `${SYSTEM_PROMPT}\n\n${catalogText}`
      : SYSTEM_PROMPT;

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemContent },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Intenta en un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos de IA agotados. Agrega saldo en tu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "Error del gateway IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(aiResp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-ia error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
