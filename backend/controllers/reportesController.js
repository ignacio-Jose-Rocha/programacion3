const ReportesController = {
    generarReporte: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en generarReporte:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    obtenerReportes: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en obtenerReportes:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default ReportesController;