import ReclamoOficinaDB from '../database/reclamoOficinaDB.js';
import NotificacionEmail from './notificacionEmailService.js';

const ReclamoOficinaService = {
    obtenerReclamosOficina: async (idUsuario) => {
        try {
            const reclamos = await ReclamoOficinaDB.obtenerReclamosOficinaDB(idUsuario);
            return reclamos;
        } catch (error) {
            throw new Error("Error al obtener reclamos de oficina: " + error.message);
        }
    },

    atenderReclamo: async (idReclamo, idUsuario, nuevoEstado) => {
        try {
            // Verificar que el empleado puede atender este reclamo
            const puedeAtender = await ReclamoOficinaDB.verificarEmpleadoPuedeAtenderDB(idReclamo, idUsuario);
            if (!puedeAtender) {
                throw new Error("No tienes permisos para atender este reclamo");
            }

            // Actualizar estado del reclamo
            await ReclamoOficinaDB.actualizarEstadoReclamoDB(idReclamo, nuevoEstado);

            // Obtener datos del reclamo para notificación
            const reclamo = await ReclamoOficinaDB.obtenerReclamoPorIdDB(idReclamo);
            const estadoDescripcion = await ReclamoOficinaDB.obtenerEstadoDescripcionDB(nuevoEstado);

            // Enviar notificación
            const notificacion = await NotificacionEmail(reclamo, estadoDescripcion.descripcion);

            return { reclamo, notificacion };
        } catch (error) {
            throw new Error("Error al atender reclamo: " + error.message);
        }
    },

    finalizarReclamo: async (idReclamo, idUsuario) => {
        try {
            // Verificar que el empleado puede finalizar este reclamo
            const puedeAtender = await ReclamoOficinaDB.verificarEmpleadoPuedeAtenderDB(idReclamo, idUsuario);
            if (!puedeAtender) {
                throw new Error("No tienes permisos para finalizar este reclamo");
            }

            // Finalizar reclamo (estado 4)
            await ReclamoOficinaDB.finalizarReclamoDB(idReclamo, idUsuario);

            // Obtener datos del reclamo para notificación
            const reclamo = await ReclamoOficinaDB.obtenerReclamoPorIdDB(idReclamo);
            const notificacion = await NotificacionEmail(reclamo, "Finalizado");

            return { reclamo, notificacion };
        } catch (error) {
            throw new Error("Error al finalizar reclamo: " + error.message);
        }
    }
};

export default ReclamoOficinaService;