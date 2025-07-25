import oficinaService from '../services/oficinaService.js';

const OficinaController = {
    getAllOficinas: async (req, res) => {
        try {
            const oficinas = await oficinaService.getAllOficinas();
            res.status(200).json({
                estado: "OK",
                data: oficinas
            });
        } catch (error) {
            console.error("Error en getAllOficinas:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    getEmpleadosByOficina: async (req, res) => {
        try {
            const { idOficina } = req.params;
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en getEmpleadosByOficina:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    asignarEmpleadoAOficina: async (req, res) => {
        try {
            const { idOficina, idUsuario } = req.params;
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en asignarEmpleadoAOficina:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    eliminarEmpleadoDeOficina: async (req, res) => {
        try {
            const { idUsuario } = req.params;
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en eliminarEmpleadoDeOficina:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },
 
    crearOficina: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en crearOficina:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    actualizarOficina: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en actualizarOficina:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    borrarOficina: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en borrarOficina:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default OficinaController;
