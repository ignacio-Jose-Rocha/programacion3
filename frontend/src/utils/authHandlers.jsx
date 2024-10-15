
export const redirectUser = (usuario, navigate) => {
  if (usuario.idTipoUsuario === 3) navigate("/dashboard-cliente");
  else if (usuario.idTipoUsuario === 2) navigate("/dashboard-empleado");
  else if (usuario.idTipoUsuario === 1) navigate("/dashboard-admin");
};

export const handleLoginSuccess = (token, usuario, setIsAuthenticated, navigate) => {
  setIsAuthenticated(true);
  localStorage.setItem("authToken", token);
  localStorage.setItem("idTipoUsuario", usuario.idTipoUsuario);
  redirectUser(usuario, navigate); // Redirigir al usuario
};

export const handleLogout = (setIsAuthenticated, navigate) => {
  setIsAuthenticated(false);
  localStorage.removeItem("authToken");
  localStorage.removeItem("idTipoUsuario");
  navigate("/");
};
