import redisClient from "../index.js";
import ReclamoDB from '../database/reclamoDB.js';
import NotificacionEmail from "../services/notificacionEmailService.js";

const ReclamoService = {

  getAllReclamos: async () => {
    const cacheKey = "reclamos";
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const rows = await ReclamoDB.obtenerReclamosDB();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
    return rows;
  },

  crearReclamo: async (asunto, descripcion, idUsuarioCreador, idReclamoTipo) => {
    try{
      if (!asunto || !descripcion || !idReclamoTipo) {
        const errores = [];
        if (!asunto) errores.push("asunto");
        if (!descripcion) errores.push("descripcion");
        if (!idReclamoTipo) errores.push("idReclamoTipo");
        throw new Error(`Faltan los siguientes datos requeridos: ${errores.join(', ')}`);
      }

      // Verificar si el reclamo ya existe
      const  existeReclamo = await ReclamoDB.buscarReclamoPorUsuarioYAsuntoDB(idUsuarioCreador, asunto);
      if (existeReclamo != null) {
        throw new Error('Este reclamo ya existe.');
      }

      const fechaCreado = new Date();
      const idReclamoEstado = 1; // Estado inicial de un reclamo (por ejemplo, "Pendiente")

      // Crear el reclamo en la base de datos
      const idReclamo = await ReclamoDB.crearReclamoDB({
        asunto,
        descripcion,
        fechaCreado,
        idReclamoEstado,
        idReclamoTipo,
        idUsuarioCreador,
      });

      return {
        id: idReclamo,
        asunto,
        descripcion,
        fechaCreado,
        idReclamoEstado,
        idReclamoTipo,
        idUsuarioCreador,
        };
    }
    catch(error){
      throw new Error ("error al crear reclamo: " + error.message)
    }
  },

  cancelarReclamo: async (idCliente, idReclamo) => {
    try {
      const reclamo = await ReclamoDB.obtenerReclamoPorClienteYReclamoDB(idCliente, idReclamo);
      if (!reclamo) {
        throw new Error("No se encontró el reclamo");
      }
      if (reclamo.idReclamoEstado === 3) {
        throw new Error("Su reclamo ya ha sido cancelado");
      }
      if (reclamo.idReclamoEstado !== 1) {
        throw new Error("Su reclamo ya está siendo atendido, no puede ser cancelado");
      }
  
      await ReclamoDB.cancelarReclamoDB(idCliente, idReclamo);

      const estadoValido = await ReclamoDB.obtenerEstadoReclamoPorId(3);
      
      return await NotificacionEmail(reclamo, estadoValido.descripcion);

    } catch (error) {
      throw new Error(error.message);
    }
  },


  obtenerReclamoEstado: async (idCliente) => {
    try { 
      const reclamos = await ReclamoDB.obtenerReclamosPorUsuarioDB(idCliente);
      
      if (reclamos.length === 0) {
        throw new Error("No se encontró ningún reclamo para este cliente");
      }
      
      return {reclamos, message: "Reclamos obtenidos exitosamente" };
      
    } catch (error) {
      throw new Error(error.message);
    }
  },


};

export default ReclamoService;
