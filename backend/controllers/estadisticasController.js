import EstadisticasService from '../services/estadisticasService.js';

const EstadisticasController = {
    obtenerEstadisticas: async (req, res) => {
        try {
            const estadisticas = await EstadisticasService.obtenerEstadisticasCompletas();
            res.status(200).json({
                estado: "OK",
                data: estadisticas
            });
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
            res.status(500).json({ error: error.message });
        }
    },

    obtenerEstadisticasPorTipo: async (req, res) => {
        try {
            const estadisticas = await EstadisticasService.obtenerEstadisticasPorTipo();
            res.status(200).json({
                estado: "OK",
                data: estadisticas
            });
        } catch (error) {
            console.error("Error al obtener estadísticas por tipo:", error);
            res.status(500).json({ error: error.message });
        }
    },

    obtenerEstadisticasPorEstado: async (req, res) => {
        try {
            const estadisticas = await EstadisticasService.obtenerEstadisticasPorEstado();
            res.status(200).json({
                estado: "OK",
                data: estadisticas
            });
        } catch (error) {
            console.error("Error al obtener estadísticas por estado:", error);
            res.status(500).json({ error: error.message });
        }
    }
};

export default EstadisticasController;