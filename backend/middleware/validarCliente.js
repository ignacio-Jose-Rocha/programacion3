// middlewares/validarCliente.js
import clienteSchema  from './validaciones.js'; // Ajusta la ruta según la ubicación de tu archivo

const validarCliente = (req, res, next) => {
    const { error } = clienteSchema.validate(req.body);
    
    // Si hay un error de validación, devuelve un error 400 con detalles
    if (error) {
        return res.status(400).json({ 
            estado: "Falla", 
            mensaje: error.details.map(err => err.message) // Muestra los mensajes de error
        });
    }

    next(); // Si no hay errores, continúa al siguiente middleware o controlador
};

export default validarCliente;
