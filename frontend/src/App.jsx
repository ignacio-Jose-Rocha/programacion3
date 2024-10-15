import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/routes";
import Navbar from "./pages/Navbar/Navbar.jsx";
import Footer from "./pages/Footer/Footer.jsx";
import Login from "./auth/Login/Login.jsx";
import Register from "./auth/Registro/Registrarse.jsx";
import { useState } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import { ToastContainer, toast} from "react-toastify"; // Importa ToastContainer y toast
import "react-toastify/dist/ReactToastify.css"; // Importa estilos de Toastify

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
    toast.success("Inicio de sesión exitoso."); // Muestra la notificación
    setTimeout(() => {
      setShowLogin(false); // Cierra el formulario de inicio de sesión
     
    }, 4000);
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
          onLoginSuccess={login}
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
        location.pathname !== "/dashboard-admin" && <Footer />}

      <ToastContainer
        position="top-right" // Puedes cambiar la posición
        autoClose={5000} // Duración en milisegundos
        hideProgressBar={false} // Mostrar barra de progreso
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
      />
    </>
  );
}

export default App;
