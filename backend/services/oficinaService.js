import AdminDB from "../database/adminDB.js"; // Asegúrate de que la ruta sea correcta
import redisClient from "../index.js"

const oficinaService = {
  getAllOficinas: async () => {
    const cacheKey = "oficinas";
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log("Datos obtenidos de la caché");
      return JSON.parse(cachedData);
    }

    const rows = await AdminDB.getAllOficinasDB();
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
    return rows;
  },

  getEmpleadosByOficina: async (idOficina) => {
    const cacheKey = `empleadosOficina:${idOficina}`;
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log("Datos obtenidos de la caché");
      return JSON.parse(cachedData);
    }

    const rows = await AdminDB.getEmpleadosByOficinaDB(idOficina);
    if (rows.length === 0) {
      throw new Error("Oficina sin empleados asignados");
    }

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
    return rows;
  },

  asignarEmpleadoAOficina: async (idOficina, idUsuario) => {
    try {
      const idAsignacion = await AdminDB.asignarEmpleadoDB(idOficina, idUsuario);
      return idAsignacion;
    } catch (error) {
      throw new Error("Error al asignar el empleado a la oficina: " + error.message);
    }
  },

  eliminarEmpleadoDeOficina: async (idUsuario) => {
    try {
      const result = await AdminDB.eliminarEmpleadoDeOficinaDB(idUsuario);
      return result; // Retorna el resultado para manejarlo en el controlador
    } catch (error) {
      throw new Error("Error al desactivar el usuario de la oficina: " + error.message);
    }
  },
};

export default oficinaService;