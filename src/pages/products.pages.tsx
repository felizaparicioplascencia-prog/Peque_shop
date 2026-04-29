import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";
import { COMPUTER_PRODUCTS, CATEGORIAS, type ComputerProduct, type Categoria } from "@/data/products";
import { cn } from "@/lib/utils";

const ProductsPage = () => {
  const [filter, setFilter] = useState<Categoria | "Todos">("Todos");
  const [adding, setAdding] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const products = filter === "Todos"
    ? COMPUTER_PRODUCTS
    : COMPUTER_PRODUCTS.filter((p) => p.categoria === filter);

  const addToCart = async (product: ComputerProduct) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setAdding(product.id);
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();

    let error;
    if (existing) {
      ({ error } = await supabase.from("cart_items").update({ quantity: existing.quantity + 1 }).eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        product_title: product.nombre,
        product_price: product.precio,
        product_image: null,
        quantity: 1,
      }));
    }
    setAdding(null);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Añadido al carrito", description: product.nombre });
  };

  const filterChips: Array<Categoria | "Todos"> = ["Todos", ...CATEGORIAS];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">Catálogo de Computación</h1>
          <p className="text-muted-foreground">Laptops, monitores y componentes seleccionados.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {filterChips.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                filter === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-card-foreground border-border hover:border-primary/50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <article
                key={product.id}
                className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all flex flex-col"
              >
                <div className="relative aspect-square bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Icon className="absolute top-2 right-2 w-6 h-6 text-primary bg-background/80 backdrop-blur rounded-md p-1" strokeWidth={1.75} />
                </div>
                <span className="text-xs font-medium text-accent uppercase tracking-wider mb-1">
                  {product.categoria}
                </span>
                <h3 className="font-bold text-card-foreground mb-1 line-clamp-2">{product.nombre}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{product.descripcion}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-foreground">${product.precio.toLocaleString()}</span>
                </div>
                <Button
                  variant="hero"
                  onClick={() => addToCart(product)}
                  disabled={adding === product.id}
                  className="w-full"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {adding === product.id ? "Añadiendo..." : "Agregar al carrito"}
                </Button>
              </article>
            );
          })}
        </div>

        {products.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No hay productos en esta categoría.</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
