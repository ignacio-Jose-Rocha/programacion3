import oficinas from "../database/oficinasDB.js";
import redisClient from "../index.js"

const oficinaService = {
  getAllOficinas: async () => {
    const cacheKey = "oficinas";
    const cachedData = await redisClient.get(cacheKey);
    
    if (cachedData) {
      console.log("Datos obtenidos de la caché");
      return JSON.parse(cachedData);
    }

    const rows = await oficinas.getAllOficinasDB();
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

    const rows = await oficinas.getEmpleadosByOficinaDB(idOficina);
    if (rows.length === 0) {
      throw new Error("Oficina sin empleados asignados");
    }

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
    return rows;
  },


  asignarEmpleadoAOficina: async (idOficina, idUsuario) => {
    try {
      // Verificar si el empleado existe y cumple con las condiciones
      const existe = await oficinas.buscarEmpleadoDB(idUsuario);
      if (existe.length === 0){
        throw new Error("Empleado no encontrado");
      }
      if (existe.activo !== 1){
        throw new Error("El usuario está inactivo");
      }
      if(existe.idTipoUsuario !== 2){
        throw new Error("El usuario no es de tipo empleado");
      }
      // Obtener los empleados ya asignados a la oficina
      const empleados= await oficinas.getEmpleadosByOficinaDB(idOficina);
    
      // Verificar si el empleado ya está asignado a la oficina
      const idUsuarioNumero = Number(idUsuario); // Lo convierto en numero ya que viene como string para realizar la comparación
      const yaAsignado = empleados.some(empleado => empleado.idUsuario === idUsuarioNumero);
      if (yaAsignado) {
        throw new Error("El empleado ya está asignado en la oficina");
      }
      // Agregar empleado a oficina
      const idAsignacion = await oficinas.asignarEmpleadoDB(idOficina, idUsuario);
      return idAsignacion;
    } catch (error) {
      throw new Error("Error al asignar el empleado a la oficina: " + error.message);
    }
  },

  eliminarEmpleadoDeOficina: async (idUsuario) => {
    try {
      const result = await oficinas.eliminarEmpleadoDeOficinaDB(idUsuario);
      return result; // Retorna el resultado para manejarlo en el controlador
    } catch (error) {
      throw new Error("Error al desactivar el usuario de la oficina: " + error.message);
    }
  },
};

export default oficinaService;