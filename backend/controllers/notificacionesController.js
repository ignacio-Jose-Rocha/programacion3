import NotificacionEmail from '../services/notificacionEmailService.js';

const notificacionesController = {
    enviarNotificacionEmail: async (req, res) => {
        try {
            const { reclamo, estadoReclamo } = req.body;
            
            if (!reclamo || !estadoReclamo) {
                return res.status(400).json({ 
                    error: "Faltan datos requeridos: reclamo y estadoReclamo" 
                });
            }

            const resultado = await NotificacionEmail(reclamo, estadoReclamo);
            
            if (resultado.estado) {
                res.status(200).json({
                    mensaje: resultado.mensaje,
                    notificacion: resultado.notificacion
                });
            } else {
                res.status(500).json({ error: resultado.mensaje });
            }
        } catch (error) {
            console.error("Error en enviarNotificacionEmail:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    notificarCambioEstadoReclamo: async (req, res) => {
        try {
            const { idReclamo } = req.params;
            const { estadoReclamo, reclamo } = req.body;

            if (!estadoReclamo || !reclamo) {
                return res.status(400).json({ 
                    error: "Faltan datos requeridos: estadoReclamo y reclamo" 
                });
            }

            const resultado = await NotificacionEmail(reclamo, estadoReclamo);
            
            if (resultado.estado) {
                res.status(200).json({
                    mensaje: `Notificación enviada para reclamo ${idReclamo}`,
                    detalle: resultado.mensaje,
                    notificacion: resultado.notificacion
                });
            } else {
                res.status(500).json({ error: resultado.mensaje });
            }
        } catch (error) {
            console.error("Error en notificarCambioEstadoReclamo:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default notificacionesController;
