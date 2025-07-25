import ReclamosEstadoDB from "../database/reclamosEstadoDB.js";
import redisClient from "../index.js";

const ReclamosEstadoService = {
    getAllReclamosEstado: async () => {
        try {
            const cacheKey = "reclamosEstado";
            const cachedData = await redisClient.get(cacheKey);
            
            if (cachedData) {
                return JSON.parse(cachedData);
            }

            const estados = await ReclamosEstadoDB.getAllReclamosEstadoDB();
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(estados));
            return estados;
        } catch (error) {
            throw new Error("Error al obtener estados de reclamos: " + error.message);
        }
    },

    crearReclamoEstado: async (descripcion) => {
        try {
            const nuevoEstado = await ReclamosEstadoDB.crearReclamoEstadoDB(descripcion);
            
            // Limpiar caché
            await redisClient.del("reclamosEstado");
            
            return nuevoEstado;
        } catch (error) {
            throw new Error("Error al crear estado de reclamo: " + error.message);
        }
    },

    actualizarReclamoEstado: async (idReclamoEstado, descripcion) => {
        try {
            const estadoActualizado = await ReclamosEstadoDB.actualizarReclamoEstadoDB(idReclamoEstado, descripcion);
            
            // Limpiar caché
            await redisClient.del("reclamosEstado");
            
            return estadoActualizado;
        } catch (error) {
            throw new Error("Error al actualizar estado de reclamo: " + error.message);
        }
    },

    borrarReclamoEstado: async (idReclamoEstado) => {
        try {
            await ReclamosEstadoDB.borrarReclamoEstadoDB(idReclamoEstado);
            
            // Limpiar caché
            await redisClient.del("reclamosEstado");
        } catch (error) {
            throw new Error("Error al eliminar estado de reclamo: " + error.message);
        }
    }
};

export default ReclamosEstadoService;