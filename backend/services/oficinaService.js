import OficinasDB from "../database/oficinasDB.js";
import redisClient from "../index.js"

const oficinaService = {
  getAllOficinas: async () => {
    try{
      const cacheKey = "oficinas";
      const cachedData = await redisClient.get(cacheKey);
    
      if (cachedData) {
        console.log("Datos obtenidos de la caché");
        return JSON.parse(cachedData);
      }

      const rows = await OficinasDB.getAllOficinasDB();
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
      return rows;
    }
    catch(error){
      throw new Error ("Error al obtener oficinas: " + error.message);
    }
  },

  getEmpleadosByOficina: async (idOficina) => {
    try{
      const cacheKey = `empleadosOficina:${idOficina}`;
      const cachedData = await redisClient.get(cacheKey);
    
      if (cachedData) {
        console.log("Datos obtenidos de la caché");
        return JSON.parse(cachedData);
      }

      const rows = await OficinasDB.getEmpleadosByOficinaDB(idOficina);
      if (rows.length === 0) {
        throw new Error("Oficina sin empleados asignados");
      }

      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
      return rows;
    }
    catch (error) {
      throw new Error ("Error al obtener empleados de oficina: " + error.message);
    }
  },


  asignarEmpleadoAOficina: async (idOficina, idUsuario) => {
    try {
      const existe = await OficinasDB.buscarEmpleadoDB(idUsuario);
      if (!existe){
        throw new Error("Empleado no encontrado");
      }
      if (existe.activo !== 1){
        throw new Error("El usuario está inactivo");
      }
      if(existe.idTipoUsuario !== 2){
        throw new Error("El usuario no es de tipo empleado");
      }
      
      const empleados = await OficinasDB.getEmpleadosByOficinaDB(idOficina);
      const idUsuarioNumero = Number(idUsuario);
      const yaAsignado = empleados.some(empleado => empleado.idUsuario === idUsuarioNumero);
      if (yaAsignado) {
        throw new Error("El empleado ya está asignado en la oficina");
      }
      
      const idAsignacion = await OficinasDB.asignarEmpleadoDB(idOficina, idUsuario);
      return idAsignacion;
    } catch (error) {
      throw new Error("Error al asignar el empleado a la oficina: " + error.message);
    }
  },

  eliminarEmpleadoDeOficina: async (idUsuario) => {
    try {
      const result = await OficinasDB.eliminarEmpleadoDeOficinaDB(idUsuario);
      return result;
    } catch (error) {
      throw new Error("Error al desactivar el usuario de la oficina: " + error.message);
    }
  },
};

export default oficinaService;
