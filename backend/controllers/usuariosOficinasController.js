const UsuariosOficinasController = {
    asignarUsuarioOficina: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en asignarUsuarioOficina:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    obtenerUsuariosOficina: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en obtenerUsuariosOficina:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    removerUsuarioOficina: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en removerUsuarioOficina:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default UsuariosOficinasController;