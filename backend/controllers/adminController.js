import pool from "../config.js";
import PDFDocument from "pdfkit";
import AdminDB from "../database/adminDB.js";
import ReclamosTipoService from "../services/reclamosTipoService.js";
import AdminService from "../services/adminService.js";
import oficinaService from "../services/oficinaService.js";

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

  // Controlador para obtener empleados
  getAllEmpleados: async (req, res) => {
    try {
      const empleados = await AdminService.getAllEmpleados();
      res.json(empleados);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      res.status(500).json({ error: "Error al obtener los empleados" });
    }
  },

  // Controlador para obtener clientes
  getAllClientes: async (req, res) => {
    try {
      const clientes = await AdminService.getAllClientes();
      res.json(clientes);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      res.status(500).json({ error: "Error al obtener los clientes" });
    }
  },

  getAllReclamos: async (req, res) => {
    try {
      const rows = await reclamoService.getAllReclamos();
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los reclamos:", error);
      res.status(500).json({ error: "Error al obtener los reclamos" });
    }
  },

  getAllReclamosTipo: async (req, res) => {
    try {
      // Llamar al servicio para obtener los tipos de reclamos
      const result = await ReclamosTipoService.getAllReclamosTipo();

      // Manejar la respuesta según el estado devuelto por el servicio
      if (result.status === 404) {
        return res.status(404).json({ mensaje: result.mensaje });
      }

      return res.status(200).json(result.data);
    } catch (error) {
      console.error(
        "Error en ReclamosTipoController.getAllReclamosTipo:",
        error
      );
      return res
        .status(500)
        .json({ error: "Error al obtener los tipos de reclamos." });
    }
  },

  getAllOficinas: async (req, res) => {
    try {
      const rows = await oficinaService.getAllOficinas();
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener las oficinas:", error);
      res.status(500).json({ error: "Error al obtener las oficinas" });
    }
  },

  getEmpleadosByOficina: async (req, res) => {
    const { idOficina } = req.params;
    try {
      const rows = await oficinaService.getEmpleadosByOficina(idOficina);
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los empleados de la oficina:", error);
      res.status(500).json({ error: error.message });
    }
  },

  getEstadisticasCompletas: async (req, res) => {
    try {
      const resultados = await AdminDB.getEstadisticasCompletasDB();

      const totalReclamos = resultados[0]; // Primer conjunto: total de reclamos
      const reclamosPorEstado = resultados[1]; // Segundo conjunto: reclamos por estado

      res.json({ totalReclamos, reclamosPorEstado });
    } catch (error) {
      console.error(
        "Error al obtener estadísticas completas de reclamos",
        error
      );
      res
        .status(500)
        .json({ error: "Error al obtener estadísticas completas de reclamos" });
    }
  },

  crearReclamoTipo: async (req, res) => {
    const { descripcion, activo = 1 } = req.body;

    if (!descripcion) {
      return res
        .status(400)
        .json({ error: "Falta ingresar la descripción del reclamo" });
    }

    try {
      // Llamar al servicio para crear el tipo de reclamo
      const result = await ReclamosTipoService.crearReclamoTipo(
        descripcion,
        activo
      );

      // Manejar la respuesta según el resultado del servicio
      if (result.status === 400) {
        return res.status(400).json({ error: result.error });
      }

      return res.status(200).json({
        message: result.message,
        id: result.id,
        descripcion: result.descripcion,
      });
    } catch (error) {
      console.error("Error en ReclamosTipoController.crearReclamoTipo:", error);
      return res.status(500).json({
        error: "Error al crear tipo de reclamo",
        details: error.message,
      });
    }
  },

  actualizarReclamoTipo: async (req, res) => {
    const { idReclamoTipo } = req.params;
    const { descripcion } = req.body;

    try {
      // Llamar al servicio para realizar la actualización
      const resultado = await ReclamosTipoService.actualizarReclamoTipo(
        idReclamoTipo,
        descripcion
      );

      // Enviar la respuesta
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        details: error.stack,
      });
    }
  },

  borrarReclamoTipo: async (req, res) => {
    const { idReclamoTipo } = req.params;
    try {
      await ReclamosTipoService.borrarReclamoTipo(idReclamoTipo);
      res.status(200).json({
        message: "Reclamo tipo desactivado con éxito",
        id: idReclamoTipo,
      });
    } catch (error) {
      if (error.message === "Reclamo tipo no encontrado") {
        return res
          .status(404)
          .json({ error: "Reclamo a eliminar no encontrado" });
      }
      res.status(500).json({
        error: "Error al desactivar tipo de reclamo",
        details: error.message,
      });
    }
  },

  crearUsuario: async (req, res) => {
    const {
      nombre,
      apellido,
      correoElectronico,
      contrasenia,
      idTipoUsuario,
      imagen,
    } = req.body;

    try {
      const result = await AdminService.crearUsuario({
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        idTipoUsuario,
        imagen,
      });

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
      const result = await AdminService.actualizarUsuario(
        idUsuarioModificado,
        idUsuarioModificador,
        datosUsuario
      );

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
  },

  //agregar validacion de q exista el empleado activo a agregar y sea de idTipo 2 sino no corresponde y que no este asignado a ninguna oficina
  asignarEmpleadoAOficina: async (req, res) => {
    const { idOficina, idUsuario } = req.params;
    try {
      const idAsignacion = await oficinaService.asignarEmpleadoAOficina(idOficina, idUsuario);
      res.json({
        message: "Empleado asignado a la oficina correctamente",
        id: idAsignacion,
      });
    } catch (error) {
      console.error("Error al asignar el empleado a la oficina:", error);
      res.status(500).json({ error: error.message });
    }
  },

  eliminarEmpleadoDeOficina: async (req, res) => {
    const { idUsuario } = req.params;
    try {
      const result = await oficinaService.eliminarEmpleadoDeOficina(idUsuario);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Usuario no encontrado en la oficina" });
      }

      res.json({ message: "Usuario desactivado de la oficina correctamente" });
    } catch (error) {
      console.error("Error al desactivar el usuario de la oficina:", error);
      res.status(500).json({ error: error.message });
    }
  },

  descargarReclamosPDF: async (req, res) => {
    try {
      // Realizar la consulta de los reclamos
      const [reclamos] = await pool.query("SELECT * FROM reclamos");

      // Crear un nuevo documento PDF
      const doc = new PDFDocument();

      // Configurar el encabezado de la respuesta para enviar un archivo PDF
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=reclamos.pdf");

      // Escribir el PDF directamente en la respuesta
      doc.pipe(res);

      // Agregar contenido al PDF
      doc.fontSize(18).text("Informe de Reclamos", { align: "center" });

      reclamos.forEach((reclamo) => {
        doc.moveDown();
        doc.text(`Asunto: ${reclamo.asunto}`);
        doc.text(`Descripción: ${reclamo.descripcion}`);
        doc.text(`Fecha de Creación: ${reclamo.fechaCreado}`);
        doc.text(`Estado: ${reclamo.idReclamoEstado}`);
        doc.moveDown();
      });

      // Finalizar el documento PDF
      doc.end();
    } catch (error) {
      console.error("Error al generar el archivo PDF", error);
      res.status(500).json({ error: "Error al generar el archivo PDF" });
    }
  },
};

export default AdminController;
