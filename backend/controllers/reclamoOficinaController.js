import ReclamoOficinaService from '../services/reclamoOficinaService.js';

const ReclamoOficinaController = {
    obtenerReclamosOficina: async (req, res) => {
        try {
            const { idUsuario } = req.user;
            const reclamos = await ReclamoOficinaService.obtenerReclamosOficina(idUsuario);
            res.status(200).json({
                estado: "OK",
                data: reclamos
            });
        } catch (error) {
            console.error("Error al obtener reclamos de oficina:", error);
            res.status(500).json({ error: error.message });
        }
    },

    atenderReclamo: async (req, res) => {
        try {
            const { idReclamo } = req.params;
            const { idUsuario } = req.user;
            const { nuevoEstado } = req.body;

            if (!nuevoEstado) {
                return res.status(400).json({ 
                    error: "El nuevo estado es requerido" 
                });
            }

            const resultado = await ReclamoOficinaService.atenderReclamo(idReclamo, idUsuario, nuevoEstado);
            res.status(200).json({
                estado: "OK",
                mensaje: "Reclamo atendido exitosamente",
                data: resultado
            });
        } catch (error) {
            console.error("Error al atender reclamo:", error);
            res.status(400).json({ error: error.message });
        }
    },

    finalizarReclamo: async (req, res) => {
        try {
            const { idReclamo } = req.params;
            const { idUsuario } = req.user;

            const resultado = await ReclamoOficinaService.finalizarReclamo(idReclamo, idUsuario);
            res.status(200).json({
                estado: "OK",
                mensaje: "Reclamo finalizado exitosamente",
                data: resultado
            });
        } catch (error) {
            console.error("Error al finalizar reclamo:", error);
            res.status(400).json({ error: error.message });
        }
    }
};

export default ReclamoOficinaController;