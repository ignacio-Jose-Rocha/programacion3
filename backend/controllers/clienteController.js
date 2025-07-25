import ClienteService from '../services/clienteService.js';

const ClienteController = {
    crearCliente: async (req, res) => {
        try {
            const { nombre, apellido, correoElectronico, contrasenia } = req.body;
            const imagen = req.file ? req.file.filename : null;

            const nuevoCliente = await ClienteService.crearCliente(
                nombre,
                apellido,
                correoElectronico,
                contrasenia,
                imagen
            );

            res.status(201).json({
                estado: "OK",
                mensaje: "Cliente creado exitosamente",
                data: nuevoCliente
            });
        } catch (error) {
            console.error("Error en crearCliente:", error);
            res.status(400).json({
                estado: "Falla",
                mensaje: error.message
            });
        }
    },

    actualizarCliente: async (req, res) => {
        try {
            const { idUsuario } = req.user;
            const datosActualizacion = req.body;
            const imagen = req.file ? req.file.filename : null;
            
            if (imagen) {
                datosActualizacion.imagen = imagen;
            }

            const clienteActualizado = await ClienteService.actualizarCliente(idUsuario, datosActualizacion);
            res.status(200).json({
                estado: "OK",
                mensaje: "Cliente actualizado exitosamente",
                data: clienteActualizado
            });
        } catch (error) {
            console.error("Error en actualizarCliente:", error);
            res.status(400).json({ error: error.message });
        }
    }
};

export default ClienteController;
