const EstadisticasController = {
    getEstadisticas: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en getEstadisticas:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default EstadisticasController;
