import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Cpu, MonitorPlay, MemoryStick, HardDrive, Server, Zap, Box, Fan, Check, ShoppingCart, GraduationCap, Clock, Users, Wrench, BookOpen, Award, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import EnrollmentDialog, { type CoursePlan } from "@/components/EnrollmentDialog";

type PartCategory =
  | "Procesador"
  | "Tarjeta Gráfica"
  | "Memoria RAM"
  | "Almacenamiento"
  | "Placa Base"
  | "Fuente de Poder"
  | "Gabinete"
  | "Refrigeración";

interface Part {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
}

interface CategoryDef {
  key: PartCategory;
  icon: LucideIcon;
  options: Part[];
}

const CATEGORIES: CategoryDef[] = [
  {
    key: "Procesador",
    icon: Cpu,
    options: [
      { id: 1001, nombre: "Intel Core i5-14600K", precio: 319, descripcion: "14 núcleos, 5.3 GHz boost" },
      { id: 1002, nombre: "Intel Core i9-14900K", precio: 589, descripcion: "24 núcleos, 6.0 GHz boost" },
      { id: 1003, nombre: "AMD Ryzen 7 7800X3D", precio: 449, descripcion: "8 núcleos, ideal gaming" },
      { id: 1004, nombre: "AMD Ryzen 9 7950X", precio: 549, descripcion: "16 núcleos, 5.7 GHz" },
    ],
  },
  {
    key: "Tarjeta Gráfica",
    icon: MonitorPlay,
    options: [
      { id: 2001, nombre: "NVIDIA RTX 4060 Ti", precio: 449, descripcion: "8GB GDDR6, 1440p" },
      { id: 2002, nombre: "NVIDIA RTX 4070 SUPER", precio: 649, descripcion: "12GB GDDR6X, DLSS 3" },
      { id: 2003, nombre: "NVIDIA RTX 4080 SUPER", precio: 999, descripcion: "16GB GDDR6X, 4K" },
      { id: 2004, nombre: "NVIDIA RTX 4090", precio: 1799, descripcion: "24GB GDDR6X, tope de gama" },
    ],
  },
  {
    key: "Memoria RAM",
    icon: MemoryStick,
    options: [
      { id: 3001, nombre: "Corsair Vengeance 16GB DDR5", precio: 89, descripcion: "5600 MHz, 2x8GB" },
      { id: 3002, nombre: "Corsair Vengeance 32GB DDR5", precio: 149, descripcion: "6000 MHz, 2x16GB" },
      { id: 3003, nombre: "G.Skill Trident Z5 64GB", precio: 289, descripcion: "DDR5 6400, RGB" },
    ],
  },
  {
    key: "Almacenamiento",
    icon: HardDrive,
    options: [
      { id: 4001, nombre: "Samsung 990 Pro 1TB NVMe", precio: 119, descripcion: "PCIe 4.0, 7450 MB/s" },
      { id: 4002, nombre: "Samsung 990 Pro 2TB NVMe", precio: 189, descripcion: "PCIe 4.0, 7450 MB/s" },
      { id: 4003, nombre: "WD Black SN850X 4TB", precio: 329, descripcion: "PCIe 4.0, 7300 MB/s" },
    ],
  },
  {
    key: "Placa Base",
    icon: Server,
    options: [
      { id: 5001, nombre: "ASUS ROG STRIX B760-F", precio: 249, descripcion: "LGA1700, DDR5, WiFi 6E" },
      { id: 5002, nombre: "MSI MPG X670E Carbon", precio: 449, descripcion: "AM5, PCIe 5.0, WiFi 6E" },
      { id: 5003, nombre: "Gigabyte Z790 AORUS Master", precio: 499, descripcion: "LGA1700, DDR5, Thunderbolt" },
    ],
  },
  {
    key: "Fuente de Poder",
    icon: Zap,
    options: [
      { id: 6001, nombre: "Corsair RM750e 750W", precio: 119, descripcion: "80+ Gold, modular" },
      { id: 6002, nombre: "Corsair RM850x 850W", precio: 159, descripcion: "80+ Gold, full-modular" },
      { id: 6003, nombre: "Seasonic PRIME TX-1000 1000W", precio: 299, descripcion: "80+ Titanium" },
    ],
  },
  {
    key: "Gabinete",
    icon: Box,
    options: [
      { id: 7001, nombre: "NZXT H5 Flow", precio: 99, descripcion: "ATX, mesh frontal" },
      { id: 7002, nombre: "Lian Li O11 Dynamic EVO", precio: 169, descripcion: "Dual chamber, vidrio" },
      { id: 7003, nombre: "Fractal Design Torrent", precio: 199, descripcion: "Máximo airflow" },
    ],
  },
  {
    key: "Refrigeración",
    icon: Fan,
    options: [
      { id: 8001, nombre: "Noctua NH-D15", precio: 109, descripcion: "Aire, doble torre" },
      { id: 8002, nombre: "Corsair iCUE H100i Elite", precio: 169, descripcion: "Líquida 240mm" },
      { id: 8003, nombre: "NZXT Kraken Elite 360", precio: 279, descripcion: "Líquida 360mm, LCD" },
    ],
  },
];

const PCBuilder = () => {
  const [selection, setSelection] = useState<Record<PartCategory, Part | null>>(() =>
    CATEGORIES.reduce((acc, c) => ({ ...acc, [c.key]: null }), {} as Record<PartCategory, Part | null>)
  );
  const [adding, setAdding] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const total = useMemo(
    () => Object.values(selection).reduce((sum, p) => sum + (p?.precio ?? 0), 0),
    [selection]
  );

  const selectedCount = useMemo(
    () => Object.values(selection).filter(Boolean).length,
    [selection]
  );

  const allSelected = selectedCount === CATEGORIES.length;

  const select = (cat: PartCategory, part: Part) => {
    setSelection((prev) => ({ ...prev, [cat]: prev[cat]?.id === part.id ? null : part }));
  };

  const addBuildToCart = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!allSelected) {
      toast({ title: "Configuración incompleta", description: "Selecciona un componente por categoría.", variant: "destructive" });
      return;
    }
    setAdding(true);
    const resumen = Object.values(selection)
      .filter(Boolean)
      .map((p) => p!.nombre)
      .join(" + ");

    const buildId = Date.now() % 1_000_000_000;

    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: buildId,
      product_title: `PC Personalizada: ${resumen}`,
      product_price: total,
      product_image: null,
      quantity: 1,
    });
    setAdding(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "PC añadida al carrito", description: `Total: $${total.toLocaleString()}` });
      navigate("/carrito");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="mb-10 max-w-3xl">
          <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-3">Servicio</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Arma tu PC a tu gusto</h1>
          <p className="text-muted-foreground">
            Elige cada componente y construye la computadora perfecta para ti. Te entregamos el equipo armado y listo para usar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-8">
            {CATEGORIES.map(({ key, icon: Icon, options }) => (
              <section key={key}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{key}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {options.map((part) => {
                    const active = selection[key]?.id === part.id;
                    return (
                      <button
                        key={part.id}
                        onClick={() => select(key, part)}
                        className={cn(
                          "text-left bg-card border rounded-xl p-4 transition-all relative",
                          active
                            ? "border-gold ring-2 ring-gold/30 shadow-lg"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        {active && (
                          <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                            <Check className="w-4 h-4 text-accent-foreground" />
                          </span>
                        )}
                        <h3 className="font-semibold text-card-foreground mb-1 pr-8">{part.nombre}</h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{part.descripcion}</p>
                        <span className="text-lg font-bold text-foreground">${part.precio.toLocaleString()}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          <aside className="lg:sticky lg:top-24 h-fit bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Tu configuración</h2>
            <div className="space-y-2 mb-6">
              {CATEGORIES.map(({ key }) => {
                const part = selection[key];
                return (
                  <div key={key} className="flex justify-between gap-3 text-sm border-b border-border pb-2">
                    <div className="min-w-0">
                      <div className="text-muted-foreground text-xs">{key}</div>
                      <div className="text-card-foreground font-medium truncate">
                        {part?.nombre ?? "— Sin elegir —"}
                      </div>
                    </div>
                    <div className="font-semibold text-foreground whitespace-nowrap">
                      {part ? `$${part.precio.toLocaleString()}` : "—"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Componentes</span>
              <span className="text-foreground font-medium">{selectedCount}/{CATEGORIES.length}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-foreground">Total</span>
              <span className="text-3xl font-bold text-foreground">${total.toLocaleString()}</span>
            </div>

            <Button
              variant="hero"
              onClick={addBuildToCart}
              disabled={!allSelected || adding}
              className="w-full"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {adding ? "Añadiendo..." : allSelected ? "Añadir al carrito" : "Selecciona todos los componentes"}
            </Button>
          </aside>
        </div>

        {/* Curso de armado de PC */}
        <section className="mt-24">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <p className="text-gold uppercase tracking-[0.2em] text-sm font-medium mb-3">Servicio adicional</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Curso de armado de PC</h2>
            <p className="text-muted-foreground">
              Aprende paso a paso a ensamblar tu propia computadora con instructores expertos. Teoría, práctica y certificación incluidas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: BookOpen, title: "Teoría completa", desc: "Conoce cada componente, compatibilidades y especificaciones." },
              { icon: Wrench, title: "Práctica real", desc: "Arma una PC desde cero con equipos reales en nuestro taller." },
              { icon: Award, title: "Certificación", desc: "Recibe un diploma avalado al completar el curso." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-bold text-card-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {([
              {
                plan: "basico" as CoursePlan,
                nombre: "Curso Básico",
                precio: 99,
                duracion: "8 horas",
                cupo: "Grupos de 6",
                temas: ["Identificación de componentes", "Montaje de CPU y RAM", "Instalación de Windows", "Primeros encendidos"],
                destacado: false,
              },
              {
                plan: "intermedio" as CoursePlan,
                nombre: "Curso Intermedio",
                precio: 199,
                duracion: "16 horas",
                cupo: "Grupos de 5",
                temas: ["Todo lo del básico", "Refrigeración líquida", "Cable management profesional", "Overclocking seguro", "Diagnóstico de fallas"],
                destacado: true,
              },
              {
                plan: "pro" as CoursePlan,
                nombre: "Curso Pro",
                precio: 349,
                duracion: "32 horas",
                cupo: "Grupos de 4",
                temas: ["Todo lo del intermedio", "Builds de alto rendimiento", "Workstations y servidores", "Modding y custom loops", "Asesoría 1 a 1 post-curso"],
                destacado: false,
              },
            ]).map((curso) => (
              <div
                key={curso.nombre}
                className={cn(
                  "bg-card border rounded-xl p-6 flex flex-col relative",
                  curso.destacado ? "border-gold ring-2 ring-gold/30 shadow-lg" : "border-border"
                )}
              >
                {curso.destacado && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Más popular
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground">{curso.nombre}</h3>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">${curso.precio}</span>
                  <span className="text-muted-foreground text-sm"> / persona</span>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground mb-4 pb-4 border-b border-border">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {curso.duracion}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {curso.cupo}</span>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {curso.temas.map((t) => (
                    <li key={t} className="flex items-start gap-2 text-sm text-card-foreground">
                      <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={curso.destacado ? "hero" : "outline"}
                  className="w-full"
                  onClick={() => setEnrollment({ plan: curso.plan, label: curso.nombre })}
                >
                  Inscribirme
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PCBuilder;
