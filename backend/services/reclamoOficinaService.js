
import ReclamoOficinaDB from "../database/reclamoOficinaDB.js";
import NotificacionEmail from "../services/notificacionEmailService.js";
import ReclamoDB from "../database/reclamoDB.js"


const ReclamoOficinaService = {
  listarReclamosOficina: async (idEmpleado) => {
    const reclamos = await ReclamoOficinaDB.obtenerReclamosPorOficinaDB(idEmpleado);

    if (reclamos.length === 0) {
      throw new Error(
        `No se encontraron reclamos para la oficina asignada al empleado con ID ${idEmpleado}`
      );
    }

    return reclamos;
  },

  actualizarEstadoReclamo: async (idEmpleado, idCliente, nuevoEstado, idReclamo) => {
    const estadoNumerico = parseInt(nuevoEstado, 10);

    const reclamo = await ReclamoDB.obtenerReclamoPorClienteYReclamoDB(idCliente, idReclamo);

    if (!reclamo) {
      throw new Error("No se encontró el reclamo para este usuario.");
    }
    
    const estaAsignado = await ReclamoOficinaDB.verificarEmpleadoAsignado(idEmpleado, reclamo.idOficina);
    
    if (!estaAsignado) {
      throw new Error("Este reclamo no le corresponde a su oficina");
    }

    const estadoValido = await ReclamoDB.obtenerEstadoReclamoPorId(estadoNumerico);
    
    if (!estadoValido) {
      throw new Error("El estado proporcionado no es válido. Debe ser un número entre 1 y 4.");
    }

    if (reclamo.idReclamoEstado === 3) {
      throw new Error("Reclamo ya cancelado.");
    }
    if (reclamo.idReclamoEstado === 4) {
      throw new Error("Reclamo ya finalizado.");
    }

    const resultado = await ReclamoOficinaDB.actualizarEstadoReclamoDB(idReclamo, idCliente, estadoNumerico, idEmpleado);

    if (resultado.affectedRows === 0) {
      throw new Error("El estado no se pudo actualizar.");
    }

    return await NotificacionEmail(reclamo, estadoValido.descripcion);

  } 

};

export default ReclamoOficinaService;
