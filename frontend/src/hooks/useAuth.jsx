import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { redirectUser } from "../utils/authHandlers"; // Asegúrate de importar la función

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const idTipoUsuario = localStorage.getItem("idTipoUsuario");

    if (token && idTipoUsuario) {
      setIsAuthenticated(true);
      redirectUser({ idTipoUsuario }, navigate); // Redirigir al usuario
    }
  }, [navigate]);

  const login = (token, usuario) => {
    setIsAuthenticated(true);
    localStorage.setItem("authToken", token);
    localStorage.setItem("idTipoUsuario", usuario.idTipoUsuario);
    redirectUser(usuario, navigate); // Redirigir al usuario
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("idTipoUsuario");
    navigate("/");
  };

  return { isAuthenticated, login, logout };
};
