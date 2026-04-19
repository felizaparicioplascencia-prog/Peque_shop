import { Button } from "@/components/ui/button";
import logoIcon from "@/assets/logo-icon.png";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="PEQUE_SHOP logo" width={32} height={32} className="w-8 h-8" />
          <span className="text-lg font-bold tracking-tight" style={{ background: 'linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 75%), hsl(0 0% 100%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PEQUE_SHOP
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-primary-foreground/70 hover:text-gold text-sm font-medium transition-colors">Inicio</a>
          <a href="#" className="text-primary-foreground/70 hover:text-gold text-sm font-medium transition-colors">Servicios</a>
          <a href="#" className="text-primary-foreground/70 hover:text-gold text-sm font-medium transition-colors">Nosotros</a>
          <Button variant="hero" size="sm" asChild>
            <a href="mailto:peque_shop@gmail.com">Contacto</a>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
