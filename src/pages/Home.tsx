import { ShoppingBag, ShoppingCart, Settings } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const cards = [
  {
    icon: ShoppingBag,
    title: "Explorar productos",
    description: "Consulta los productos disponibles en nuestro catálogo.",
  },
  {
    icon: ShoppingCart,
    title: "Carrito de compras",
    description: "Agrega productos al carrito y gestiona tu pedido.",
  },
  {
    icon: Settings,
    title: "Administrar productos",
    description: "Crea, edita y elimina productos fácilmente.",
  },
];

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 px-6 text-center" style={{ background: "var(--hero-gradient)" }}>
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Bienvenido a PEQUE_SHOP
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Tu tienda favorita para explorar productos, agregarlos al carrito y
            administrar un CRUD completo.
          </p>
        </section>

        {/* Cards */}
        <section className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card) => (
              <div
                key={card.title}
                className="group bg-card rounded-lg border border-border p-8 shadow-sm hover:shadow-lg hover:border-accent transition-all duration-300"
              >
                <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-md bg-accent/15 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
