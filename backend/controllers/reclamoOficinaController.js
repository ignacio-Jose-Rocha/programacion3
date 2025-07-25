import ReclamoOficinaService from '../services/reclamoOficinaService.js';

const ReclamoOficinaController = {
    listarReclamosOficina: async (req, res) => {
        try {
            const { idUsuario } = req.user;
            const reclamos = await ReclamoOficinaService.listarReclamosOficina(idUsuario);
            
            res.status(200).json({
                estado: "OK",
                data: reclamos
            });
        } catch (error) {
            console.error("Error en listarReclamosOficina:", error);
            res.status(400).json({ 
                estado: "Falla",
                mensaje: error.message 
            });
        }
    },

    ActualizarEstadoReclamo: async (req, res) => {
        try {
            const { idCliente, idReclamo, nuevoEstado } = req.params;
            const { idUsuario } = req.user;
            
            const resultado = await ReclamoOficinaService.actualizarEstadoReclamo(
                idUsuario, 
                idCliente, 
                nuevoEstado, 
                idReclamo
            );
            
            res.status(200).json({
                estado: "OK",
                mensaje: "Estado del reclamo actualizado correctamente",
                data: resultado
            });
        } catch (error) {
            console.error("Error en ActualizarEstadoReclamo:", error);
            res.status(400).json({ 
                estado: "Falla",
                mensaje: error.message 
            });
        }
    }
};

export default ReclamoOficinaController;
