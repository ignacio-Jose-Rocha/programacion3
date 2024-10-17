import AdminDB from "../database/adminDB.js";
import redisClient from "../index.js";

const ReclamosTipoService = {

  getAllReclamosTipo: async () => {
    try {
      const cacheKey = "reclamosTipo"; // Definir una clave para Redis

      // Verificar si los datos ya están en caché
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Datos obtenidos de la caché");
        return {
          status: 200,
          data: JSON.parse(cachedData),
        };
      }

      // Si no hay datos en caché, obtenerlos de la base de datos
      const rows = await AdminDB.getAllReclamosTipoDB();

      // Si no se encuentran tipos de reclamos activos
      if (rows.length === 0) {
        return {
          status: 404,
          mensaje: "No se encontraron tipos de reclamos activos.",
        };
      }

      // Almacenar los resultados en Redis con una expiración de 1 hora (3600 segundos)
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));

      return {
        status: 200,
        data: rows,
      };
    } catch (error) {
      console.error("Error al obtener tipos de reclamos:", error);
      throw error;
    }
  },

  crearReclamoTipo: async (descripcion, activo = 1) => {
    try {
      // Verificar si el reclamo tipo ya existe
      const [[reclamosTipo]] = await AdminDB.getReclamoTipoByDescripcionDB(descripcion);

      if (reclamosTipo) {
        return {
          status: 400,
          error: `Ya existe el reclamo tipo ID: ${reclamosTipo.idReclamoTipo} con la descripción: ${descripcion}`,
        };
      }

      // Crear el tipo de reclamo en la base de datos
      const result = await AdminDB.crearReclamoTipoDB(descripcion, activo);

      return {
        status: 200,
        message: "Tipo de reclamo creado con éxito",
        id: result.insertId,
        descripcion,
      };
    } catch (error) {
      console.error("Error al crear tipo de reclamo:", error);
      throw new Error("Error al crear tipo de reclamo");
    }
  },

  actualizarReclamoTipo: async (idReclamoTipo, descripcion) => {
    try {
      // Verificar si el reclamo tipo existe en la base de datos
      const [[reclamoTipo]] = await AdminDB.getReclamoTipoByIdDB(idReclamoTipo);
      
      if (!reclamoTipo) {
        throw new Error("Reclamo tipo a actualizar no encontrado");
      }

      // Validar que haya una descripción para actualizar
      if (!descripcion) {
        throw new Error("No se envió modificación alguna");
      }

      // Actualizar el tipo de reclamo
      await AdminDB.actualizarReclamoTipoDB(idReclamoTipo, descripcion);

      // Retornar el resultado
      return {
        message: "Actualización de reclamo tipo con éxito",
        id: reclamoTipo.idReclamoTipo,
        descripcion,
      };
    } catch (error) {
      throw error;
    }
  },

  borrarReclamoTipo: async (idReclamoTipo) => {
    try {
      // Verificar si el reclamo tipo existe
      const reclamoTipo = await AdminDB.getReclamoTipoByIdDB(idReclamoTipo);
      if (!reclamoTipo) {
        throw new Error("Reclamo tipo no encontrado");
      }
  
      // Desactivar el reclamo tipo
      await AdminDB.borrarReclamoTipoDB(idReclamoTipo);
    } catch (error) {
      console.error("Error al borrar el reclamo tipo:", error);
      throw error; // Lanza el error para que sea manejado en el controlador
    }
  },

};

export default ReclamosTipoService;
