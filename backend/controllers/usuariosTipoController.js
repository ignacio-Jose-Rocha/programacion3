const UsuariosTipoController = {
    getAllUsuariosTipo: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en getAllUsuariosTipo:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    crearUsuarioTipo: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en crearUsuarioTipo:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    actualizarUsuarioTipo: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en actualizarUsuarioTipo:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    borrarUsuarioTipo: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en borrarUsuarioTipo:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default UsuariosTipoController;