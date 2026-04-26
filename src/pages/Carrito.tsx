import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

interface CartItem {
  id: string;
  product_id: number;
  product_title: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
}

const Carrito = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  const updateQty = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return remove(item.id);
    const { error } = await supabase.from("cart_items").update({ quantity: newQty }).eq("id", item.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else load();
  };

  const total = items.reduce((sum, i) => sum + Number(i.product_price) * i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8" /> Tu carrito
        </h1>

        {loading ? (
          <p className="text-muted-foreground">Cargando...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">Tu carrito está vacío</p>
            <Button variant="hero" onClick={() => navigate("/productos")}>Ver productos</Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                  {item.product_image && (
                    <div className="w-24 h-24 bg-muted rounded flex items-center justify-center shrink-0">
                      <img src={item.product_image} alt={item.product_title} className="object-contain h-full w-full p-2" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-card-foreground line-clamp-2">{item.product_title}</h3>
                    <p className="text-accent font-bold mt-1">${Number(item.product_price).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="icon" variant="outline" onClick={() => updateQty(item, -1)}><Minus className="w-4 h-4" /></Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button size="icon" variant="outline" onClick={() => updateQty(item, 1)}><Plus className="w-4 h-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(item.id)} className="ml-auto text-destructive"><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
              <h2 className="text-xl font-bold text-card-foreground mb-4">Resumen</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${total.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Envío</span><span>Gratis</span></div>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4 mb-6">
                <span>Total</span><span className="text-accent">${total.toFixed(2)}</span>
              </div>
              <Button variant="hero" className="w-full" onClick={() => navigate("/checkout")}>
                Finalizar compra
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Carrito;
