export const redirectUser = (usuario, navigate) => {
  if (usuario.idTipoUsuario === 3) navigate("/dashboard-cliente");
  else if (usuario.idTipoUsuario === 2) navigate("/dashboard-empleado");
  else if (usuario.idTipoUsuario === 1) navigate("/dashboard-admin");
};

