import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

const Checkout = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ direccion: "", ciudad: "", tarjeta: "" });

  useEffect(() => {
    if (!user) return;
    supabase.from("cart_items").select("*").eq("user_id", user.id).then(({ data }) => setItems(data ?? []));
  }, [user]);

  const total = items.reduce((s, i) => s + Number(i.product_price) * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({ title: "Carrito vacío", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    // Simulación: vacía el carrito
    await supabase.from("cart_items").delete().eq("user_id", user!.id);
    setSubmitting(false);
    setSuccess(true);
    toast({ title: "¡Compra exitosa!", description: "Gracias por tu pedido" });
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-card border border-border rounded-lg p-12 text-center max-w-md">
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-card-foreground mb-3">¡Compra exitosa!</h1>
            <p className="text-muted-foreground mb-6">Recibirás un correo con los detalles de tu pedido.</p>
            <Button variant="hero" onClick={() => navigate("/productos")}>Seguir comprando</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-card-foreground mb-2">Datos de envío</h2>
            <div>
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} required maxLength={200} />
            </div>
            <div>
              <Label htmlFor="ciudad">Ciudad</Label>
              <Input id="ciudad" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} required maxLength={100} />
            </div>
            <h2 className="text-xl font-bold text-card-foreground pt-4 mb-2">Pago (simulado)</h2>
            <div>
              <Label htmlFor="tarjeta">Número de tarjeta</Label>
              <Input id="tarjeta" placeholder="4242 4242 4242 4242" value={form.tarjeta} onChange={(e) => setForm({ ...form, tarjeta: e.target.value })} required maxLength={19} />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={submitting || items.length === 0}>
              {submitting ? "Procesando..." : `Pagar $${total.toFixed(2)}`}
            </Button>
          </form>
          <div className="bg-card border border-border rounded-lg p-6 h-fit">
            <h2 className="text-lg font-bold mb-4">Resumen ({items.length})</h2>
            <div className="space-y-2 text-sm mb-4 max-h-64 overflow-y-auto">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between gap-2">
                  <span className="line-clamp-1 text-muted-foreground">{i.product_title} ×{i.quantity}</span>
                  <span className="shrink-0">${(Number(i.product_price) * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total</span><span className="text-accent">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
