import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-primary/60" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="text-gold uppercase tracking-[0.3em] text-sm font-medium mb-6 animate-fade-in">
          Innovación · Excelencia · Resultados
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight tracking-tight">
          Donde otros ven fallos,{" "}
          <span className="text-gold">nosotros vemos la conexión perfecta</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Somos tu aliado estratégico para llevar tu negocio al siguiente nivel
          con tecnología de vanguardia y estrategias probadas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="text-base px-8 py-6" asChild>
            <Link to="/productos">Comenzar ahora</Link>
          </Button>
          <Button variant="heroOutline" size="lg" className="text-base px-8 py-6" asChild>
            <Link to="/productos">Conocer más</Link>
          </Button>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/productos"
            className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg px-8 py-6 text-center shadow-lg hover:bg-primary-foreground/15 transition-colors block"
          >
            <h3 className="text-2xl font-bold text-primary-foreground mb-1">
              Productos
            </h3>
            <p className="text-primary-foreground/75 text-sm">
              Explora nuestro catálogo completo
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
