import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight" style={{ background: 'linear-gradient(135deg, hsl(0 0% 0%), hsl(0 0% 30%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          PEQUE<span style={{ background: 'linear-gradient(135deg, hsl(0 0% 10%), hsl(0 0% 40%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>_SHOP</span>
        </span>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-primary-foreground/70 hover:text-gold text-sm font-medium transition-colors">Inicio</a>
          <a href="#" className="text-primary-foreground/70 hover:text-gold text-sm font-medium transition-colors">Servicios</a>
          <a href="#" className="text-primary-foreground/70 hover:text-gold text-sm font-medium transition-colors">Nosotros</a>
          <Button variant="hero" size="sm">Contacto</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
