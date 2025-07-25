import EstadisticasDB from '../database/estadisticasCompletasDB.js';
import redisClient from '../index.js';

const EstadisticasService = {
    obtenerEstadisticasCompletas: async () => {
        try {
            const cacheKey = "estadisticas_completas";
            const cachedData = await redisClient.get(cacheKey);
            
            if (cachedData) {
                return JSON.parse(cachedData);
            }

            const estadisticas = await EstadisticasDB.obtenerEstadisticasCompletas();
            await redisClient.setEx(cacheKey, 1800, JSON.stringify(estadisticas));
            return estadisticas;
        } catch (error) {
            throw new Error("Error al obtener estadísticas: " + error.message);
        }
    },

    obtenerEstadisticasPorTipo: async () => {
        try {
            const estadisticas = await EstadisticasDB.obtenerEstadisticasPorTipo();
            return estadisticas;
        } catch (error) {
            throw new Error("Error al obtener estadísticas por tipo: " + error.message);
        }
    },

    obtenerEstadisticasPorEstado: async () => {
        try {
            const estadisticas = await EstadisticasDB.obtenerEstadisticasPorEstado();
            return estadisticas;
        } catch (error) {
            throw new Error("Error al obtener estadísticas por estado: " + error.message);
        }
    }
};

export default EstadisticasService;