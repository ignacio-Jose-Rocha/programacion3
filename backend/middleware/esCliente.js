const esCliente = (req, res, next) => {
    if (req.user.idTipoUsuario !== 3) {
      return res.status(403).json({ error: 'Acceso denegado. Solo los clientes pueden acceder.' });
    }
    next(); 
  };
  
  export default esCliente;