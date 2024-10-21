import ReclamoOficinaService from "../services/reclamoOficinaService.js";


// VERIFICAR QUE ATIENDA LOS RECLAMOS DE SU OFICINA EN EL ACTUALIAZAR ESTADO RECLAMO

const ReclamoOficinaController = {
  listarReclamosOficina: async (req, res) => {
    const { idEmpleado } = req.params;
    try {
      const reclamos = await ReclamoOficinaService.listarReclamosOficina(idEmpleado);
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
      const resultado = await ReclamoOficinaService.actualizarEstadoReclamo(
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

export default ReclamoOficinaController;
