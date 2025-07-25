import ReclamosEstadoService from "../services/reclamosEstadoService.js";

const reclamosEstadoController = {
    getAllReclamosEstado: async (req, res) => {
        try {
            const estados = await ReclamosEstadoService.getAllReclamosEstado();
            res.status(200).json({
                estado: "OK",
                data: estados
            });
        } catch (error) {
            console.error("Error en getAllReclamosEstado:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    crearReclamoEstado: async (req, res) => {
        try {
            const { descripcion } = req.body;
            
            if (!descripcion) {
                return res.status(400).json({ error: "La descripción es requerida" });
            }

            const nuevoEstado = await ReclamosEstadoService.crearReclamoEstado(descripcion);
            res.status(201).json({
                estado: "OK",
                mensaje: "Estado de reclamo creado exitosamente",
                data: nuevoEstado
            });
        } catch (error) {
            console.error("Error en crearReclamoEstado:", error);
            res.status(500).json({ error: error.message });
        }
    },

    actualizarReclamoEstado: async (req, res) => {
        try {
            const { idReclamoEstado } = req.params;
            const { descripcion } = req.body;

            if (!descripcion) {
                return res.status(400).json({ error: "La descripción es requerida" });
            }

            const estadoActualizado = await ReclamosEstadoService.actualizarReclamoEstado(idReclamoEstado, descripcion);
            res.status(200).json({
                estado: "OK",
                mensaje: "Estado de reclamo actualizado exitosamente",
                data: estadoActualizado
            });
        } catch (error) {
            console.error("Error en actualizarReclamoEstado:", error);
            res.status(500).json({ error: error.message });
        }
    },

    borrarReclamoEstado: async (req, res) => {
        try {
            const { idReclamoEstado } = req.params;

            await ReclamosEstadoService.borrarReclamoEstado(idReclamoEstado);
            res.status(200).json({
                estado: "OK",
                mensaje: "Estado de reclamo eliminado exitosamente"
            });
        } catch (error) {
            console.error("Error en borrarReclamoEstado:", error);
            res.status(500).json({ error: error.message });
        }
    }
};

export default reclamosEstadoController;
