import { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Carousel from "./components/Inicio/Carousel";
import Cards from "./components/Nosotros/Cards.jsx";
import SobreNosotrosText from "./components/Nosotros/sobreNosotrosText.jsx";
import Card from "./components/Institucion/Card";
import Galery from "./components/Institucion/Modelos.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Contacto from "./components/Contacto/Form.jsx";
import ClienteDashboard from "./components/Dashboard/DashboardCliente.jsx"; 
import "./index.css";
import PropTypes from 'prop-types'; 

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
  const navigate = useNavigate(); // Aquí inicializamos navigate

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("Token de localStorage:", token); // Verifica el token
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleLoginSuccess = (token) => {
    setShowLogin(false);
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token);
    navigate("/dashboard"); // Redirige al dashboard después de iniciar sesión
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
  };

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} onLogout={handleLogout} isAuthenticated={isAuthenticated} />
      {showLogin && (
        <Login onClose={handleCloseLogin} onLoginSuccess={handleLoginSuccess} />
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ClienteDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
