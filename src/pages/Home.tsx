import Header from "../components/Header"
import Footer from "../components/Footer"

function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />

      <main>
        <h2>Bienvenido a nuestra tienda</h2>

        <p>
          En esta tienda podrás ver productos, agregarlos al carrito
          y administrar un CRUD completo de productos.
        </p>

        <section>
          <div>
            <h3>Explorar productos</h3>
            <p>Consulta los productos disponibles.</p>
          </div>

          <div>
            <h3>Carrito de compras</h3>
            <p>Agrega productos al carrito.</p>
          </div>

          <div>
            <h3>Administrar productos</h3>
            <p>Crea, edita y elimina productos.</p>
          </div>
        </section>

      </main>

      <Footer />

    </div>
  )
}

export default Home
