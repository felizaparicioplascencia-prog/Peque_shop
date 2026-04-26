import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getProductos } from "@/services/api/producto/productos.services";
import { Product } from "@/interfaces/products";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<number | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getProductos()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const addToCart = async (product: Product) => {
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
        product_title: product.title,
        product_price: product.price,
        product_image: product.image,
        quantity: 1,
      }));
    }
    setAdding(null);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Añadido al carrito", description: product.title });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">Productos</h1>

        {loading ? (
          <p className="text-muted-foreground">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center overflow-hidden">
                  <img src={product.image} alt={product.title} className="object-contain h-full w-full p-4" />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 flex-1">{product.title}</h3>
                <p className="text-accent font-bold text-lg mb-3">${product.price}</p>
                <Button variant="hero" onClick={() => addToCart(product)} disabled={adding === product.id} className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {adding === product.id ? "Añadiendo..." : "Añadir al carrito"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;

