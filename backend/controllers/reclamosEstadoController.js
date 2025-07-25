import ReclamosEstadoService from '../services/reclamosEstadoService.js';

const ReclamosEstadoController = {
    getAllEstados: async (req, res) => {
        try {
            const estados = await ReclamosEstadoService.getAllEstados();
            res.status(200).json({
                estado: "OK",
                data: estados
            });
        } catch (error) {
            console.error("Error al obtener estados:", error);
            res.status(500).json({ error: error.message });
        }
    },

    crearEstado: async (req, res) => {
        try {
            const { descripcion } = req.body;
            
            if (!descripcion) {
                return res.status(400).json({ error: "La descripción es requerida" });
            }

            const nuevoEstado = await ReclamosEstadoService.crearEstado(descripcion);
            res.status(201).json({
                estado: "OK",
                mensaje: "Estado creado exitosamente",
                data: nuevoEstado
            });
        } catch (error) {
            console.error("Error al crear estado:", error);
            res.status(400).json({ error: error.message });
        }
    },

    actualizarEstado: async (req, res) => {
        try {
            const { id } = req.params;
            const { descripcion } = req.body;

            if (!descripcion) {
                return res.status(400).json({ error: "La descripción es requerida" });
            }

            const estadoActualizado = await ReclamosEstadoService.actualizarEstado(id, descripcion);
            res.status(200).json({
                estado: "OK",
                mensaje: "Estado actualizado exitosamente",
                data: estadoActualizado
            });
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            res.status(400).json({ error: error.message });
        }
    },

    eliminarEstado: async (req, res) => {
        try {
            const { id } = req.params;

            await ReclamosEstadoService.eliminarEstado(id);
            res.status(200).json({
                estado: "OK",
                mensaje: "Estado eliminado exitosamente"
            });
        } catch (error) {
            console.error("Error al eliminar estado:", error);
            res.status(400).json({ error: error.message });
        }
    }
};

export default ReclamosEstadoController;