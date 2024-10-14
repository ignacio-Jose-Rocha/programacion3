import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate, useLocation } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Registrarse/Registrarse.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Carousel from "./components/Inicio/Carousel";
import Cards from "./components/Nosotros/Cards.jsx";
import SobreNosotrosText from "./components/Nosotros/sobreNosotrosText.jsx";
import Card from "./components/Institucion/Card";
import Galery from "./components/Institucion/Modelos.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Contacto from "./components/Contacto/Form.jsx";
import ClienteDashboard from "./components/dashboard-cliente/DashboardCliente.jsx";
import EmpleadoDashboard from "./components/dashboard-empleado/DashboardEmpleado.jsx";
import AdminDashboard from "./components/dashboard-admin/DashboardAdmin.jsx";
import "./index.css";
import PropTypes from "prop-types";

const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/" />;
};

ProtectedRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // Estado para el registro
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const idTipoUsuario = localStorage.getItem("idTipoUsuario");

    if (token && idTipoUsuario) {
      setIsAuthenticated(true);

      // Redirigir al dashboard correspondiente si ya está autenticado
      if (idTipoUsuario === "3") {
        navigate("/dashboard-cliente");
      } else if (idTipoUsuario === "2") {
        navigate("/dashboard-empleado");
      } else if (idTipoUsuario === "1") {
        navigate("/dashboard-admin");
      }
    }
  }, [navigate]);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false); // Cerrar el registro al abrir el login
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false); // Cerrar el login al abrir el registro
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleCloseRegister = () => {
    setShowRegister(false);
  };

  const handleLoginSuccess = (token, usuario) => {
    setShowLogin(false);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token);
    localStorage.setItem("idTipoUsuario", usuario.idTipoUsuario);

    // Redirigir según el tipo de usuario
    if (usuario.idTipoUsuario === 3) {
      navigate("/dashboard-cliente");
    } else if (usuario.idTipoUsuario === 2) {
      navigate("/dashboard-empleado");
    } else if (usuario.idTipoUsuario === 1) {
      navigate("/dashboard-admin");
    } else {
      console.error("Tipo de usuario no reconocido");
    }
  };

  const handleRegisterSuccess = (token, usuario) => {
    setShowRegister(false);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token);
    localStorage.setItem("idTipoUsuario", usuario.idTipoUsuario);

    // Redirigir según el tipo de usuario (ajusta esto según tu lógica)
    if (usuario.idTipoUsuario === 3) {
      navigate("/dashboard-cliente");
    } else if (usuario.idTipoUsuario === 2) {
      navigate("/dashboard-empleado");
    } else if (usuario.idTipoUsuario === 1) {
      navigate("/dashboard-admin");
    } else {
      console.error("Tipo de usuario no reconocido");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("idTipoUsuario");
    navigate("/"); // Redirige a la página de inicio después de cerrar sesión
  };

  return (
    <>
      {/* Mostrar Navbar solo si no está en un dashboard */}
      {location.pathname !== "/dashboard-cliente" &&
       location.pathname !== "/dashboard-empleado" &&
       location.pathname !== "/dashboard-admin" && (
        <Navbar
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick} // Agregar esta línea
          onLogout={handleLogout}
          isAuthenticated={isAuthenticated}
        />
      )}

      {showLogin && (
        <Login 
          onClose={handleCloseLogin} 
          onLoginSuccess={handleLoginSuccess} 
          onRegisterClick={handleRegisterClick} // Pasar la función al Login
        />
      )}

      {showRegister && (
        <Register 
          onClose={handleCloseRegister} 
          onRegisterSuccess={handleRegisterSuccess} 
        />
      )}

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
              <Footer />
            </>
          }
        />
        {/* Rutas protegidas según el tipo de usuario */}
        <Route
          path="/dashboard-cliente"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ClienteDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-empleado"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EmpleadoDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-admin"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
