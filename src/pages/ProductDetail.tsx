import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";
import { COMPUTER_PRODUCTS } from "@/data/products";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const product = COMPUTER_PRODUCTS.find((p) => p.id === Number(id));
  const gallery = product ? (product.imagenes && product.imagenes.length > 0 ? product.imagenes : [product.imagen]) : [];
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
          <Button asChild variant="hero">
            <Link to="/productos">Volver al catálogo</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = product.icon;

  const addToCart = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setAdding(true);
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        product_title: product.nombre,
        product_price: product.precio,
        product_image: product.imagen,
        quantity,
      }));
    }
    setAdding(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Añadido al carrito", description: `${quantity} × ${product.nombre}` });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-12">
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-2xl overflow-hidden border border-border">
              <img
                src={gallery[activeImage]}
                alt={`${product.nombre} - imagen ${activeImage + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              />
              <Icon
                className="absolute top-4 right-4 w-10 h-10 text-primary bg-background/80 backdrop-blur rounded-lg p-2"
                strokeWidth={1.75}
              />
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {gallery.map((src, idx) => (
                  <button
                    key={src + idx}
                    onClick={() => setActiveImage(idx)}
                    aria-label={`Ver imagen ${idx + 1}`}
                    aria-current={activeImage === idx}
                    className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Miniatura ${idx + 1}`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-medium text-accent uppercase tracking-wider mb-2">
              {product.categoria}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {product.nombre}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">{product.descripcion}</p>

            <div className="text-4xl font-bold text-foreground mb-8">
              ${product.precio.toLocaleString()}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Cantidad:</span>
              <div className="flex items-center border border-border rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-muted transition-colors"
                  aria-label="Disminuir"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-medium w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 hover:bg-muted transition-colors"
                  aria-label="Aumentar"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              variant="hero"
              size="lg"
              onClick={addToCart}
              disabled={adding}
              className="w-full sm:w-auto"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {adding ? "Añadiendo..." : "Agregar al carrito"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
