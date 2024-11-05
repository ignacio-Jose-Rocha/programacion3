import AdminService from "../services/adminService.js";


const AdminController = {
 
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

 
  crearUsuario: async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario } = req.body;
    const imagen = req.file ? req.file.filename : null; // Nombre del archivo guardado o null si no se sube
    try {
      const result = await AdminService.crearUsuario({ nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen });

      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error("Error en AdminController.crearUsuario:", error);
      res.status(500).json({ error: error.message });
    }
  },

  actualizarUsuario: async (req, res) => {
    const { idUsuarioModificado } = req.params;
    const datosUsuario = {
      ...req.body,
      imagen: req.file ? req.file.filename : null, 
    };
    try {
      const result = await AdminService.actualizarUsuario(idUsuarioModificado, datosUsuario);

      if (result.error) {
        return res.status(result.status).json({ error: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error("Error en AdminController.actualizarUsuario:", error);
      res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
    }
  }
};

export default AdminController;