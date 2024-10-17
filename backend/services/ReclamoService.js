import ClienteDB from '../database/clienteDB.js';
import redisClient from "../index.js";
import AdminDB from "../database/adminDB.js"
const ReclamoService = {

  getAllReclamos: async () => {
    const cacheKey = "reclamos";
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log("Datos obtenidos de la caché");
      return JSON.parse(cachedData);
    }

    const rows = await AdminDB.getAllReclamosDB();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
    return rows;
  },

  crearReclamo: async (asunto, descripcion, idUsuarioCreador, idReclamoTipo) => {
    // Validación de campos requeridos
    if (!asunto || !descripcion || !idReclamoTipo || !idUsuarioCreador) {
      const errores = [];
      if (!asunto) errores.push("asunto");
      if (!descripcion) errores.push("descripcion");
      if (!idReclamoTipo) errores.push("idReclamoTipo");
      if (!idUsuarioCreador) errores.push("idUsuarioCreador");

      throw new Error(`Faltan los siguientes datos requeridos: ${errores.join(', ')}`);
    }

    // Verificar si el reclamo ya existe
    const { existeReclamo, idTipoUsuario } = await ClienteDB.buscarReclamoPorUsuarioYAsuntoDB(idUsuarioCreador, asunto);

    if (existeReclamo > 0) {
      throw new Error('Este reclamo ya existe.');
    }

    // Verificar el tipo de usuario (solo clientes pueden crear reclamos)
    if (idTipoUsuario !== 3) {
      throw new Error('Este usuario no tiene permiso para crear reclamos.');
    }

    const fechaCreado = new Date();
    const idReclamoEstado = 1; // Estado inicial de un reclamo (por ejemplo, "Pendiente")

    // Crear el reclamo en la base de datos
    const idReclamo = await ClienteDB.crearReclamoDB({
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
  },

  obtenerTiposDeReclamos: async () => {
    try {
      const tiposReclamos = await ClienteDB.obtenerTiposDeReclamosDB();
      return tiposReclamos;
    } catch (error) {
      throw new Error('Error al obtener los tipos de reclamos: ' + error.message);
    }
  },

  cancelarReclamo: async (idCliente, idReclamo) => {
    try {
      const reclamo = await ClienteDB.buscarReclamoPorIdDB(idCliente, idReclamo);
      if (!reclamo) {
        throw new Error("No se encontró el reclamo");
      }
      if (reclamo.idReclamoEstado === 3) {
        throw new Error("Su reclamo ya ha sido cancelado");
      }
      if (reclamo.idReclamoEstado !== 1) {
        throw new Error("Su reclamo ya está siendo atendido, no puede ser cancelado");
      }
  
      await ClienteDB.cancelarReclamoDB(idCliente, idReclamo);
      return { message: "Reclamo cancelado con éxito" };
    } catch (error) {
      throw new Error(error.message);
    }
  },

  obtenerReclamosPorUsuario:  async (idUsuario) => {
    try {
      const reclamos = await ClienteDB.obtenerReclamosPorUsuarioDB(idUsuario);
      if (reclamos.length === 0) {
        throw new Error("No se encontraron reclamos para este usuario");
      }
      return reclamos;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  obtenerReclamoEstado: async (idCliente) => {
    try {
      const [[usuario]] = await ClienteDB.obtenerUsuarioPorIdDB(idCliente);
      
      if (!usuario || !usuario.idTipoUsuario) {
        throw new Error("No se encontró el cliente");
      }
      if (usuario.idTipoUsuario !== 3) {
        throw new Error("Usuario no es de tipo cliente");
      }
  
      const reclamos = await ClienteDB.obtenerReclamosPorUsuarioDB(idCliente);
      
      if (reclamos.length === 0) {
        throw new Error("No se encontró ningún reclamo para este cliente");
      }
  
      const estadoReclamo = {
        1: "Creado",
        2: "En proceso",
        3: "Cancelado",
        4: "Finalizado",
      };
  
      const reclamoEstado = reclamos.map((reclamo) => ({
        idReclamo: reclamo.idReclamo,
        asunto: reclamo.asunto,
        estado: estadoReclamo[reclamo.idReclamoEstado] || "Estado desconocido",
      }));
  
      return { idCliente, reclamos: reclamoEstado, message: "Reclamos obtenidos exitosamente" };
      
    } catch (error) {
      throw new Error(error.message);
    }
  },

};

export default ReclamoService;
