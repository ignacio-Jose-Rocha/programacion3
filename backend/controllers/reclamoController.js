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
    const { asunto, descripcion, idUsuarioCreador, idReclamoTipo } = req.body;

    try {
      const nuevoReclamo = await ReclamoService.crearReclamo(
        asunto,
        descripcion,
        idUsuarioCreador,
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

  cancelarReclamo: async (req, res) => {
    const { idCliente, idReclamo } = req.params;
    try {
      const result = await ReclamoService.cancelarReclamo(idCliente, idReclamo);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error al cancelar reclamo:", error);
      res.status(400).json({ error: error.message });
    }
  },

  obtenerReclamoId: async (req, res) => {
    const { idUsuario } = req.params;
    try {
      const reclamos = await ReclamoService.obtenerReclamosPorUsuario(
        idUsuario
      );
      res.status(200).json({ message: "Reclamos encontrados", reclamos });
    } catch (error) {
      console.error("Error al obtener reclamos:", error);
      res
        .status(
          error.message.includes("No se encontraron reclamos") ? 404 : 500
        )
        .json({ error: error.message });
    }
  },

  obtenerReclamosPorUsuario: async (req, res) => {
    const { idUsuario } = req.params;
    try {
      const reclamos = await ReclamoService.obtenerReclamosPorUsuario(
        idUsuario
      );
      res.status(200).json({ message: "Reclamos encontrados", reclamos });
    } catch (error) {
      console.error("Error al obtener reclamos:", error);
      res
        .status(
          error.message.includes("No se encontraron reclamos") ? 404 : 500
        )
        .json({ error: error.message });
    }
  },

  obtenerReclamoEstado: async (req, res) => {
    const { idCliente } = req.params;
    try {
      const {
        idCliente: clienteId,
        reclamos,
        message,
      } = await ReclamoService.obtenerReclamoEstado(idCliente);
      res.status(200).json({ idCliente: clienteId, reclamos, message });
    } catch (error) {
      console.error("Error al obtener el estado del reclamo:", error);
      return res
        .status(
          error.message.includes("No se encontró") ||
            error.message.includes("no es de tipo cliente")
            ? 404
            : 500
        )
        .json({ error: error.message });
    }
  },

  descargarReclamosPDF: async (req, res) => {
    try {
      const reclamos = await ReclamoService.obtenerReclamos(); // Llamar al servicio
      const doc = ReclamoService.generarPDF(reclamos); // Generar el PDF usando el servicio
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=reclamos.pdf");
      doc.pipe(res); // Pipe the document to the response
      doc.end(); // Finaliza el documento
    } catch (error) {
      console.error("Error al generar el PDF de reclamos:", error);
      res.status(500).json({ error: "Error al generar el PDF" });
    }
  }

};

export default ReclamoController;
