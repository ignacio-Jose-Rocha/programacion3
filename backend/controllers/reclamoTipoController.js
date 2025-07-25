import ReclamosTipoService from '../services/reclamosTipoService.js';

const ReclamoTipoController = {
    getAllReclamosTipo: async (req, res) => {
        try {
            const resultado = await ReclamosTipoService.getAllReclamosTipo();
            
            if (resultado.status === 404) {
                return res.status(404).json({
                    estado: "Falla",
                    mensaje: resultado.mensaje
                });
            }

            res.status(200).json({
                estado: "OK",
                data: resultado.data
            });
        } catch (error) {
            console.error("Error en getAllReclamosTipo:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    crearReclamoTipo: async (req, res) => {
        try {
            const { descripcion } = req.body;
            
            if (!descripcion) {
                return res.status(400).json({ error: "La descripción es requerida" });
            }

            const nuevoTipo = await ReclamosTipoService.crearReclamoTipo(descripcion);
            res.status(201).json({
                estado: "OK",
                mensaje: "Tipo de reclamo creado exitosamente",
                data: nuevoTipo
            });
        } catch (error) {
            console.error("Error en crearReclamoTipo:", error);
            res.status(500).json({ error: error.message });
        }
    },

    actualizarReclamoTipo: async (req, res) => {
        try {
            const { id } = req.params;
            const { descripcion } = req.body;

            if (!descripcion) {
                return res.status(400).json({ error: "La descripción es requerida" });
            }

            const tipoActualizado = await ReclamosTipoService.actualizarReclamoTipo(id, descripcion);
            res.status(200).json({
                estado: "OK",
                mensaje: "Tipo de reclamo actualizado exitosamente",
                data: tipoActualizado
            });
        } catch (error) {
            console.error("Error en actualizarReclamoTipo:", error);
            res.status(500).json({ error: error.message });
        }
    },

    borrarReclamoTipo: async (req, res) => {
        try {
            const { id } = req.params;

            await ReclamosTipoService.borrarReclamoTipo(id);
            res.status(200).json({
                estado: "OK",
                mensaje: "Tipo de reclamo eliminado exitosamente"
            });
        } catch (error) {
            console.error("Error en borrarReclamoTipo:", error);
            res.status(500).json({ error: error.message });
        }
    }
};

export default ReclamoTipoController;
