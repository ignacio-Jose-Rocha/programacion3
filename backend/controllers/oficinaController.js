import OficinaService from '../services/oficinaService.js';

const OficinaController = {
    getAllOficinas: async (req, res) => {
        try {
            const oficinas = await OficinaService.getAllOficinas();
            res.status(200).json({
                estado: "OK",
                data: oficinas
            });
        } catch (error) {
            console.error("Error al obtener oficinas:", error);
            res.status(500).json({ error: error.message });
        }
    },

    crearOficina: async (req, res) => {
        try {
            const { nombre, idReclamoTipo } = req.body;
            
            if (!nombre || !idReclamoTipo) {
                return res.status(400).json({ 
                    error: "Nombre y tipo de reclamo son requeridos" 
                });
            }

            const nuevaOficina = await OficinaService.crearOficina(nombre, idReclamoTipo);
            res.status(201).json({
                estado: "OK",
                mensaje: "Oficina creada exitosamente",
                data: nuevaOficina
            });
        } catch (error) {
            console.error("Error al crear oficina:", error);
            res.status(400).json({ error: error.message });
        }
    },

    actualizarOficina: async (req, res) => {
        try {
            const { id } = req.params;
            const datosActualizacion = req.body;
            
            const oficinaActualizada = await OficinaService.actualizarOficina(id, datosActualizacion);
            res.status(200).json({
                estado: "OK",
                mensaje: "Oficina actualizada exitosamente",
                data: oficinaActualizada
            });
        } catch (error) {
            console.error("Error al actualizar oficina:", error);
            res.status(400).json({ error: error.message });
        }
    },

    eliminarOficina: async (req, res) => {
        try {
            const { id } = req.params;
            await OficinaService.eliminarOficina(id);
            res.status(200).json({ 
                estado: "OK",
                mensaje: "Oficina eliminada exitosamente" 
            });
        } catch (error) {
            console.error("Error al eliminar oficina:", error);
            res.status(400).json({ error: error.message });
        }
    }
};

export default OficinaController;