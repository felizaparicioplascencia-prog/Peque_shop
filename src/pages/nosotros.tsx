import Header from "../components/Header";
import Footer from "../components/Footer";

const Nosotros = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Nosotros
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
          En PEQUE_SHOP somos una tienda dedicada a ofrecer los mejores productos
          a nuestros clientes. Nuestra misión es brindar una experiencia de
          compra única, con calidad y atención personalizada.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Nosotros;
