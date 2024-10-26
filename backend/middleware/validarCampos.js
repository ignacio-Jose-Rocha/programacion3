const validarCamposCliente = (req, res, next) => {
    const { nombre, apellido, correoElectronico, contrasenia } = req.body;
    const errores = [];
  
    if (!nombre) errores.push("nombre");
    if (!apellido) errores.push("apellido");
    if (!correoElectronico) errores.push("correoElectronico");
    if (!contrasenia) errores.push("contraseña");
  
    if (errores.length > 0) {
      return res.status(400).json({
        error: `Faltan los siguientes campos requeridos: ${errores.join(", ")}`,
      });
    }
  
    next(); 
};

export default validarCamposCliente;
  