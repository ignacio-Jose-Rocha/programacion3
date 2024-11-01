import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { redirectUser } from "../utils/authHandlers";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); // Nuevo estado para manejar el éxito del login
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const idTipoUsuario = parseInt(localStorage.getItem("idTipoUsuario"), 10); 
  
    if (token && idTipoUsuario) {
      setIsAuthenticated(true);
      redirectUser({ idTipoUsuario }, navigate); // Redirigir al usuario
    }
  }, [navigate]);

  const login = (token, usuario) => {
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token);
    localStorage.setItem("idTipoUsuario", usuario.idTipoUsuario);
    
    // Muestra el mensaje de éxito en lugar de redirigir de inmediato
    setLoginSuccess(true);

    // Después de un tiempo, redirigir al usuario
    setTimeout(() => {
      redirectUser(usuario, navigate);
    }, 2000); // Espera 2 segundos antes de redirigir
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("idTipoUsuario");
    navigate("/");
  };

  return { isAuthenticated, login, logout, loginSuccess };
};
