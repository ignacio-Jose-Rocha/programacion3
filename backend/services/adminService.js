import AdminDB from "../database/adminDB.js";
import redisClient from "../index.js";
import bcrypt from "bcrypt";

const AdminService = {
  getUsuariosByTipo: async (idTipoUsuario, cacheKey) => {
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Datos de ${cacheKey} obtenidos de la caché`);
        return JSON.parse(cachedData);
      }

      const usuarios = await AdminDB.getAllUsuariosByTipoDB(idTipoUsuario);
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(usuarios));
      return usuarios;
    } catch (error) {
      console.error(`Error en AdminService.getUsuariosByTipo(${cacheKey}):`, error);
      throw error;
    }
  },

  getAllEmpleados: function () {
    return this.getUsuariosByTipo(2, "empleados");
  },

  getAllClientes: function () {
    return this.getUsuariosByTipo(3, "clientes");
  },

  crearEmpleado: async (datosEmpleado) => {
    try {
      const { nombre, apellido, correoElectronico, password, idOficina } = datosEmpleado;

      // Validar que el email no exista
      const usuarioExistente = await AdminDB.buscarUsuarioPorEmailDB(correoElectronico);
      if (usuarioExistente) {
        throw new Error("Ya existe un usuario con este correo electrónico");
      }

      // Encriptar password
      const passwordHash = await bcrypt.hash(password, 10);

      // Crear empleado
      const idUsuario = await AdminDB.crearUsuarioDB({
        nombre,
        apellido,
        correoElectronico,
        password: passwordHash,
        idTipoUsuario: 2 // Empleado
      });

      // Asignar a oficina
      await AdminDB.asignarUsuarioOficinaDB(idUsuario, idOficina);

      // Limpiar caché
      await redisClient.del("empleados");

      return { idUsuario, nombre, apellido, correoElectronico, idOficina };
    } catch (error) {
      throw new Error("Error al crear empleado: " + error.message);
    }
  },

  actualizarEmpleado: async (idUsuario, datosActualizacion) => {
    try {
      const empleadoActualizado = await AdminDB.actualizarUsuarioDB(idUsuario, datosActualizacion);
      
      // Limpiar caché
      await redisClient.del("empleados");
      
      return empleadoActualizado;
    } catch (error) {
      throw new Error("Error al actualizar empleado: " + error.message);
    }
  },

  eliminarEmpleado: async (idUsuario) => {
    try {
      await AdminDB.eliminarUsuarioDB(idUsuario);
      
      // Limpiar caché
      await redisClient.del("empleados");
    } catch (error) {
      throw new Error("Error al eliminar empleado: " + error.message);
    }
  }
};

export default AdminService;
