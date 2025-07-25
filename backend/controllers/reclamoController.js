import ReclamoService from "../services/ReclamoService.js";

const ReclamoController = {
  getAllReclamos: async (req, res) => {
    try {
      const rows = await ReclamoService.getAllReclamos();
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los reclamos:", error);
      res.status(500).json({ error: "Error al obtener los reclamos" });
    }
  },

  crearReclamo: async (req, res) => {
    const { asunto, descripcion, idReclamoTipo } = req.body;
    const { idUsuario } = req.user;
    try {
      const nuevoReclamo = await ReclamoService.crearReclamo(
        asunto,
        descripcion,
        idUsuario,
        idReclamoTipo
      );

      res.status(200).json({
        message: "Reclamo creado con éxito",
        ...nuevoReclamo,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  obtenerReclamoEstado: async (req, res) => {
    try {
      const { idUsuario } = req.user;
      const resultado = await ReclamoService.obtenerReclamoEstado(idUsuario);
      res.status(200).json(resultado);
    } catch (error) {
      console.error("Error al obtener estado de reclamos:", error);
      res.status(400).json({ error: error.message });
    }
  },

  cancelarReclamo: async (req, res) => {
    try {
      const { idUsuario } = req.user;
      const { idReclamo } = req.params;
      
      const resultado = await ReclamoService.cancelarReclamo(idUsuario, idReclamo);
      res.status(200).json({
        message: "Reclamo cancelado exitosamente",
        notificacion: resultado
      });
    } catch (error) {
      console.error("Error al cancelar reclamo:", error);
      res.status(400).json({ error: error.message });
    }
  }
};

export default ReclamoController;
