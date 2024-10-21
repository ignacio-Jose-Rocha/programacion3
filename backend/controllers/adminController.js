import AdminService from "../services/adminService.js";
import EstadisticasService from '../services/estadisticasService.js';

const AdminController = {
  getAllAdministradores: async (req, res) => {
    try {
      const administradores = await AdminService.getAllAdministradores();
      res.json(administradores);
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      res.status(500).json({ error: "Error al obtener los administradores" });
    }
  },

  getAllEmpleados: async (req, res) => {
    try {
      const empleados = await AdminService.getAllEmpleados();
      res.json(empleados);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      res.status(500).json({ error: "Error al obtener los empleados" });
    }
  },

  getAllClientes: async (req, res) => {
    try {
      const clientes = await AdminService.getAllClientes();
      res.json(clientes);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      res.status(500).json({ error: "Error al obtener los clientes" });
    }
  },

  getEstadisticasCompletas: async (req, res) => {
    try {
      // Llama al servicio
      const estadisticas = await EstadisticasService.getEstadisticasCompletas();
      
      // Responde con los datos obtenidos
      res.json(estadisticas);
    } catch (error) {
      console.error("Error al obtener estadísticas completas de reclamos", error);
      res.status(500).json({ error: "Error al obtener estadísticas completas de reclamos" });
    }
  },

  crearUsuario: async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen } = req.body;

    try {
      const result = await AdminService.crearUsuario({ nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen });

      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error("Error en AdminController.crearUsuario:", error);
      res.status(500).json({ error: "Error al crear el usuario." });
    }
  },

  actualizarUsuario: async (req, res) => {
    const { idUsuarioModificado, idUsuarioModificador } = req.params;
    const datosUsuario = req.body;

    try {
      const result = await AdminService.actualizarUsuario(idUsuarioModificado, idUsuarioModificador, datosUsuario);

      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error("Error en AdminController.actualizarUsuario:", error);
      res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
  },

  borrarUsuario: async (req, res) => {
    const { idUsuario } = req.params;

    try {
      const result = await AdminService.borrarUsuario(idUsuario);

      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error("Error en AdminController.borrarUsuario:", error);
      res.status(500).json({ error: "Error al borrar el usuario" });
    }
  }
};

export default AdminController;