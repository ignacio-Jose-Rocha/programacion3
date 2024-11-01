import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/routes";
import Navbar from "./pages/Navbar/Navbar.jsx";
import Footer from "./pages/Footer/Footer.jsx";
import Login from "./auth/Login/Login.jsx";
import Register from "./auth/Registro/Registrarse.jsx";
import Message from "./components/message.jsx";
import { useState } from "react";
import { useLocation, Route, Routes } from "react-router-dom";


// Componentes para las páginas estáticas
import Carousel from "./pages/Inicio/Carousel.jsx";
import SobreNosotrosText from "./pages/Nosotros/SobreNosotrosText.jsx";
import Cards from "./pages/Nosotros/Cards.jsx";
import Card from "./pages/Institucion/Card.jsx";
import Galery from "./pages/Institucion/Modelos.jsx";
import Contacto from "./pages/Contacto/Form.jsx";

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Estado para controlar el mensaje de éxito
  const location = useLocation();

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleLoginSuccess = (token, user) => {
    login(token, user);
    setSuccessMessage("Inicio de sesión exitoso"); // Establecer el mensaje cuando el login sea exitoso
  };

  const handleCloseMessage = () => {
    setSuccessMessage(""); // Limpiar el mensaje cuando se cierre
  };


  
  return (
    <>
      {/* Mostrar Navbar solo si no está en un dashboard */}
      {location.pathname !== "/dashboard-cliente" &&
        location.pathname !== "/dashboard-empleado" &&
        location.pathname !== "/dashboard-admin" && (
          <Navbar
            onLoginClick={handleLoginClick}
            onRegisterClick={handleRegisterClick}
            onLogout={logout}
            isAuthenticated={isAuthenticated}
          />
        )}

      {/* Mostrar el login y registro según el estado */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
          onRegisterClick={handleRegisterClick} // Permite cambiar a registro desde el login
        />
      )}

      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          onRegisterSuccess={handleLoginSuccess}
          onLoginClick={handleLoginClick} // Permite cambiar a login desde el registro
        />
      )}

      {/* Mostrar el mensaje si existe un successMessage */}
      {successMessage && (
        <Message message={successMessage} onClose={handleCloseMessage} />
      )}

      {/* Rutas de las páginas estáticas */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div id="inicio">
                <Carousel />
              </div>
              <div id="nosotros">
                <SobreNosotrosText />
              </div>
              <Cards />
              <div id="institucion">
                <Card />
              </div>
              <Galery />
              <div id="contacto">
                <Contacto />
              </div>
            </>
          }
        />

        {/* Aquí se muestran las rutas dinámicas y protegidas */}
        <Route
          path="/*"
          element={
            <AppRoutes
              isAuthenticated={isAuthenticated}
              handleLogout={logout}
            />
          }
        />
      </Routes>

      {/* Mostrar Footer si no está en un dashboard */}
      {location.pathname !== "/dashboard-cliente" &&
        location.pathname !== "/dashboard-empleado" &&
        location.pathname !== "/dashboard-admin" && 
        <Footer />
      }

    </>
  );
}

export default App;
