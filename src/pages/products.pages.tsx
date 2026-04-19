import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getProductos } from "@/services/api/producto/productos.services";
import { Product } from "@/interfaces/products";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductos()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Productos
        </h1>

        {loading ? (
          <p className="text-muted-foreground">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-muted rounded-md mb-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="object-contain h-full w-full p-4"
                  />
                </div>
                <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-accent font-bold">${product.price}</p>
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
