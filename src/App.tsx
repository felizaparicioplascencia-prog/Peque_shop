import { Routes, Route } from "react-router-dom";
import { Home } from "./Pages/Home.pages";
import { Layout } from "./Layout/Layout.layout";
import { Products } from "./Pages/Products.pages";
import Nosotros from "./Pages/Nosotros";
import { Registro } from "./Pages/Registro";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/registro" element={<Registro />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
