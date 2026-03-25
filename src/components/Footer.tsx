import { Instagram, Facebook, Twitter } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[hsl(30,15%,25%)] text-[hsl(30,20%,90%)]">
      <div className="container mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">PEQUE_SHOP</h3>
          <p className="text-sm text-[hsl(30,10%,70%)]">Estilo clásico para personas con personalidad única.</p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4">Navegación</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition-colors">Inicio</a></li>
            <li><a href="/productos" className="hover:text-white transition-colors">Productos</a></li>
            <li><a href="/ofertas" className="hover:text-white transition-colors">Ofertas</a></li>
            <li><a href="/contacto" className="hover:text-white transition-colors">Contacto</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4">Síguenos</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[hsl(30,10%,35%)]">
        <p className="text-center text-sm text-[hsl(30,10%,60%)] py-4">
          &copy; 2026 PEQUE_SHOP — Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}

export default Footer;
