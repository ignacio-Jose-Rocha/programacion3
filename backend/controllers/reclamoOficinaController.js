import ReclamoOficinaService from "../services/reclamoOficinaService.js";


// VERIFICAR QUE ATIENDA LOS RECLAMOS DE SU OFICINA EN EL ACTUALIAZAR ESTADO RECLAMO

const ReclamoOficinaController = {
  listarReclamosOficina: async (req, res) => {
    const { idUsuario} = req.user;
    console.log(idUsuario);
    try {
      const reclamos = await ReclamoOficinaService.listarReclamosOficina(idUsuario);
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

  // AGREGAR EMPLEADO FINALIZADOR
  ActualizarEstadoReclamo: async (req, res) => {
    const { idUsuario} = req.user;
    const {idCliente, nuevoEstado, idReclamo } = req.params;
    try {
      const reclamoModificado = await ReclamoOficinaService.actualizarEstadoReclamo(
        idUsuario,
        idCliente,
        nuevoEstado,
        idReclamo
      );

      if (reclamoModificado.estado){
        res.status(200).send({estado:"OK", mensaje: reclamoModificado});
      }
      else{
        res.status(404).send({estado:"Falla", mensaje: reclamoModificado.mensaje});
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al modificar estado", detalle: error.message });
    }
  },
};

export default ReclamoOficinaController;
