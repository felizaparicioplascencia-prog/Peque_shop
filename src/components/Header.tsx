import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingCart, LogOut, User as UserIcon } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }
    const fetchCount = async () => {
      const { count } = await supabase
        .from("cart_items")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setCartCount(count ?? 0);
    };
    fetchCount();

    const channel = supabase
      .channel("cart-count")
      .on("postgres_changes", { event: "*", schema: "public", table: "cart_items", filter: `user_id=eq.${user.id}` }, fetchCount)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-gold/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoIcon} alt="PEQUE_SHOP" width={32} height={32} className="w-8 h-8" />
          <span className="text-lg font-bold tracking-tight" style={{ background: 'linear-gradient(135deg, hsl(0 0% 100%), hsl(0 0% 75%), hsl(0 0% 100%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PEQUE_SHOP
          </span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-6">
          <Link to="/" className="hidden md:inline text-primary-foreground/70 hover:text-gold text-sm font-medium transition-colors">Inicio</Link>
          <Link to="/productos" className="text-primary-foreground/70 hover:text-gold text-sm font-medium transition-colors">Productos</Link>

          {user && (
            <Link to="/carrito" className="relative text-primary-foreground/70 hover:text-gold transition-colors p-2">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-primary-foreground/70 hover:text-gold">
              <LogOut className="w-4 h-4 mr-1" /> Salir
            </Button>
          ) : (
            <Button variant="hero" size="sm" asChild>
              <Link to="/auth"><UserIcon className="w-4 h-4 mr-1" /> Entrar</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

