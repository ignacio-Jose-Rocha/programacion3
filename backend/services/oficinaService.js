import OficinaDB from '../database/oficinasDB.js';
import redisClient from '../index.js';

const OficinaService = {
    getAllOficinas: async () => {
        try {
            const cacheKey = "oficinas";
            const cachedData = await redisClient.get(cacheKey);
            
            if (cachedData) {
                return JSON.parse(cachedData);
            }

            const oficinas = await OficinaDB.getAllOficinasDB();
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(oficinas));
            return oficinas;
        } catch (error) {
            throw new Error("Error al obtener oficinas: " + error.message);
        }
    },

    crearOficina: async (nombre, idReclamoTipo) => {
        try {
            const oficinaExistente = await OficinaDB.buscarOficinaPorNombreDB(nombre);
            if (oficinaExistente) {
                throw new Error("Ya existe una oficina con ese nombre");
            }

            const idOficina = await OficinaDB.crearOficinaDB({ nombre, idReclamoTipo });
            
            // Limpiar caché
            await redisClient.del("oficinas");
            
            return { idOficina, nombre, idReclamoTipo };
        } catch (error) {
            throw new Error("Error al crear oficina: " + error.message);
        }
    },

    actualizarOficina: async (idOficina, datosActualizacion) => {
        try {
            const oficinaActualizada = await OficinaDB.actualizarOficinaDB(idOficina, datosActualizacion);
            
            // Limpiar caché
            await redisClient.del("oficinas");
            
            return oficinaActualizada;
        } catch (error) {
            throw new Error("Error al actualizar oficina: " + error.message);
        }
    },

    eliminarOficina: async (idOficina) => {
        try {
            await OficinaDB.eliminarOficinaDB(idOficina);
            
            // Limpiar caché
            await redisClient.del("oficinas");
        } catch (error) {
            throw new Error("Error al eliminar oficina: " + error.message);
        }
    }
};

export default OficinaService;