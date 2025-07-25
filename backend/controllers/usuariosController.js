const UsuariosController = {
    getAllUsuarios: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en getAllUsuarios:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    crearUsuario: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en crearUsuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    actualizarUsuario: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en actualizarUsuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    eliminarUsuario: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en eliminarUsuario:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default UsuariosController;