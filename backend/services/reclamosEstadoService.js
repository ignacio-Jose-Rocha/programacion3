import ReclamosEstadoDB from '../database/reclamosEstadoDB.js';

const ReclamosEstadoService = {
    getAllEstados: async () => {
        try {
            const estados = await ReclamosEstadoDB.getAllEstadosDB();
            return estados;
        } catch (error) {
            throw new Error("Error al obtener estados: " + error.message);
        }
    },

    crearEstado: async (descripcion) => {
        try {
            const estadoExistente = await ReclamosEstadoDB.buscarEstadoPorDescripcionDB(descripcion);
            if (estadoExistente) {
                throw new Error("Ya existe un estado con esa descripción");
            }

            const idEstado = await ReclamosEstadoDB.crearEstadoDB(descripcion);
            return { idEstado, descripcion };
        } catch (error) {
            throw new Error("Error al crear estado: " + error.message);
        }
    },

    actualizarEstado: async (idEstado, descripcion) => {
        try {
            await ReclamosEstadoDB.actualizarEstadoDB(idEstado, descripcion);
            return { idEstado, descripcion };
        } catch (error) {
            throw new Error("Error al actualizar estado: " + error.message);
        }
    },

    eliminarEstado: async (idEstado) => {
        try {
            await ReclamosEstadoDB.eliminarEstadoDB(idEstado);
        } catch (error) {
            throw new Error("Error al eliminar estado: " + error.message);
        }
    }
};

export default ReclamosEstadoService;