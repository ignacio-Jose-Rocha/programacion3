const esEmpleado = (req, res, next) => {
    if (req.user.idTipoUsuario !== 2) {
      return res.status(403).json({ error: 'Acceso denegado. Solo empleados pueden acceder.' });
    }
    next(); // Si es empleado, continuar
  };
  
  export default esEmpleado;
  