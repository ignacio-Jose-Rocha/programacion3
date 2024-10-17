import empleadoService from "../services/empleadoService.js";

const EmpleadoController = {
  listarReclamosOficina: async (req, res) => {
    const { idEmpleado } = req.params;
    try {
      const reclamos = await empleadoService.listarReclamosOficina(idEmpleado);
      res.json({ reclamos });
    } catch (error) {
      console.error("Error al listar reclamos de la oficina:", error);
      return res
        .status(
          error.message.includes("No se encontraron reclamos") ? 400 : 500
        )
        .json({ error: error.message });
    }
  },

  ActualizarEstadoReclamo: async (req, res) => {
    const { idCliente, nuevoEstado, idReclamo } = req.params;
    try {
      const resultado = await empleadoService.actualizarEstadoReclamo(
        idCliente,
        nuevoEstado,
        idReclamo
      );

      res.json(resultado);
    } catch (error) {
      console.error("Error al modificar el estado del reclamo:", error);
      res
        .status(500)
        .json({ error: "Error al modificar estado", detalle: error.message });
    }
  },
};

export default EmpleadoController;
