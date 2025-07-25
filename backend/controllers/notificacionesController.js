const NotificacionesController = {
    enviarNotificacion: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en enviarNotificacion:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    obtenerNotificaciones: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en obtenerNotificaciones:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default NotificacionesController;