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
          Transformamos ideas en{" "}
          <span className="text-gold">soluciones reales</span>
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Somos tu aliado estratégico para llevar tu negocio al siguiente nivel
          con tecnología de vanguardia y estrategias probadas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="text-base px-8 py-6">
            Comenzar ahora
          </Button>
          <Button variant="heroOutline" size="lg" className="text-base px-8 py-6">
            Conocer más
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
