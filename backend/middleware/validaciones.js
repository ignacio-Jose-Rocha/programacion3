import Joi from 'joi';

const clienteSchema = Joi.object({
    nombre: Joi.string().min(2).max(50).required(),
    apellido: Joi.string().min(2).max(50).required(),
    correoElectronico: Joi.string().email().required(),
    contrasenia: Joi.string().min(6).required()
});

const reclamoSchema = Joi.object({
    asunto: Joi.string().min(5).max(100).required(),
    descripcion: Joi.string().min(10).max(500).required(),
    idReclamoTipo: Joi.number().integer().positive().required()
});

const empleadoSchema = Joi.object({
    nombre: Joi.string().min(2).max(50).required(),
    apellido: Joi.string().min(2).max(50).required(),
    correoElectronico: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    idOficina: Joi.number().integer().positive().required()
});

export const validarCrearReclamo = (req, res, next) => {
    const { error } = reclamoSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ 
            estado: "Falla", 
            mensaje: error.details.map(err => err.message)
        });
    }

    next();
};

export const validarEmpleado = (req, res, next) => {
    const { error } = empleadoSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ 
            estado: "Falla", 
            mensaje: error.details.map(err => err.message)
        });
    }

    next();
};

export default clienteSchema;
