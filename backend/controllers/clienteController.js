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
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en actualizarCliente:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default ClienteController;
