import { useState } from "react"; // Importa useState
import Login from "./components/Login/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Carousel from "./components/Inicio/Carousel";
import Cards from "./components/Nosotros/Cards.jsx";
import SobreNosotrosText from "./components/Nosotros/sobreNosotrosText.jsx";
import Card from "./components/Institucion/Card";
import Galery from "./components/Institucion/Modelos.jsx";
import Footer from "./components/Footer.jsx";
import Contacto from "./components/Contacto/Form.jsx";
import "./index.css"; // Asegúrate de que esto esté presente para cargar Tailwind CSS.

function App() {
  const [showLogin, setShowLogin] = useState(false); // Estado para manejar la visualización del Login

  const handleLoginClick = () => {
    setShowLogin(true); // Cambia el estado a true cuando se hace clic en "Iniciar Sesión"
  };

  const handleCloseLogin = () => {
    setShowLogin(false); // Cambia el estado a false para cerrar el Login
  };

  return (
    <>
      {showLogin ? (
        <Login onClose={handleCloseLogin} /> // Usa onClose en lugar de setShowLogin
      ) : (
        <>
          <Navbar onLoginClick={handleLoginClick} /> {/* Pasa la función al Navbar */}
          <div id="inicio">
            <Carousel />
          </div>
          <div id="nosotros">
            <SobreNosotrosText />
          </div>
          <Cards />
          <div id="institucion">
            <Card />
            <Galery />
          </div>
          <div id="contacto">
            <Contacto />
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default App;
