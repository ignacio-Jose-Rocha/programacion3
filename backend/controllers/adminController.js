import AdminService from "../services/adminService.js";


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
      res.status(500).json({ error: "Error al crear el usuario." });
    }
  },

  actualizarUsuario: async (req, res) => {
    try {
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 1) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      const { idUsuarioModificado, idUsuarioModificador } = req.params;
      let {
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        idTipoUsuario,
        imagen,
        activo,
      } = req.body;

      const [[[usuarioModificador]], [[usuarioModificado]]] = await Promise.all(
        [
          pool.query("SELECT * FROM usuarios WHERE idUsuario = ?", [
            idUsuarioModificador,
          ]),
          pool.query("SELECT * FROM usuarios WHERE idUsuario = ?", [
            idUsuarioModificado,
          ]),
        ]
      );

      if (!usuarioModificado) {
        return res
          .status(404)
          .json({ error: "Usuario a modificar no encontrado" });
      }
      if (!usuarioModificador) {
        return res
          .status(404)
          .json({ error: "Usuario modificador no encontrado" });
      }
      if (usuarioModificador.idTipoUsuario != 1) {
        return res
          .status(400)
          .json({ error: "No tienes permisos para realizar esta operación" });
      }

      // Encriptar contraseña si existe
      if (contrasenia) {
        const salt = await bcrypt.genSalt(10);
        contrasenia = await bcrypt.hash(contrasenia, salt);
      }

      // Actualizar solo los campos que se envían en el cuerpo de la solicitud
      const camposAActualizar = [];
      const valores = [];

      if (nombre) camposAActualizar.push("nombre = ?"), valores.push(nombre);
      if (apellido)
        camposAActualizar.push("apellido = ?"), valores.push(apellido);
      if (correoElectronico)
        camposAActualizar.push("correoElectronico = ?"),
          valores.push(correoElectronico);
      if (contrasenia)
        camposAActualizar.push("contrasenia = ?"), valores.push(contrasenia);
      if (idTipoUsuario)
        camposAActualizar.push("idTipoUsuario = ?"),
          valores.push(idTipoUsuario);
      if (imagen) camposAActualizar.push("imagen = ?"), valores.push(imagen);
      if (typeof activo !== "undefined")
        camposAActualizar.push("activo = ?"), valores.push(activo);

      if (camposAActualizar.length > 0) {
        await AdminDB.actualizarUsuarioDB(
          idUsuarioModificado,
          camposAActualizar,
          valores
        );
      } else {
        return res.status(400).json({ mensaje: "No hay datos a modificar." });
      }

      let tipoUsuario;
      if (usuarioModificado.idTipoUsuario === 3) {
        tipoUsuario = "cliente";
      } else if (usuarioModificado.idTipoUsuario === 2) {
        tipoUsuario = "empleado";
      } else {
        tipoUsuario = "usuario";
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
  },

  borrarUsuario: async (req, res) => {
    try {
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 1) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      const { idUsuario } = req.params;
      const [[usuario]] = await pool.query(
        "SELECT * FROM usuarios WHERE idUsuario = ?",
        [idUsuario]
      );
      if (!usuario) {
        return res
          .status(404)
          .json({ error: "Usuario a borrar no encontrado" });
      }

      if (usuario.activo === 0) {
        return res
          .status(400)
          .json({ mensaje: "El usuario ya estaba desactivado" });
      }

      await AdminDB.borrarUsuarioDB(idUsuario);

      let tipoUsuario;
      if (usuario.idTipoUsuario === 3) {
        tipoUsuario = "cliente";
      } else if (usuario.idTipoUsuario === 2) {
        tipoUsuario = "empleado";
      } else {
        tipoUsuario = "usuario";
      }

      res.json(result);
    } catch (error) {
      console.error("Error en AdminController.borrarUsuario:", error);
      res.status(500).json({ error: "Error al borrar el usuario" });
    }
  },

  //agregar validacion de q exista el empleado a agregar y sea de idTipo 2 sino no corresponde
  asignarEmpleadoAOficina: async (req, res) => {
    const { idUsuario, idOficina } = req.body;
    try {
      const idAsignacion = await AdminDB.asignarEmpleadoDB(
        idUsuario,
        idOficina
      );
      res.json({
        message: "Empleado asignado a la oficina correctamente",
        id: idAsignacion,
      });
    } catch (error) {
      console.error("Error al asignar el empleado a la oficina", error);
      res.status(500).json({ error: error.message });
    }
  },

  eliminarEmpleadoDeOficina: async (req, res) => {
    const { idUsuario } = req.params;
    try {
      const result = await AdminDB.eliminarEmpleadoDeOficinaDB(idUsuario);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Usuario no encontrado en la oficina" });
      }

      res.json({ message: "Usuario desactivado de la oficina correctamente" });
    } catch (error) {
      console.error("Error al desactivar el usuario de la oficina", error);
      res
        .status(500)
        .json({ error: "Error al desactivar el usuario de la oficina" });
    }
  },

  descargarReclamosPDF: async (req, res) => {
    try {
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 1) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
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