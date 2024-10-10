import {login}  from "./authController.js";
import pool from "../config.js";
import bcrypt from "bcrypt";
import PDFDocument from "pdfkit";
import redisClient from "../index.js";
import AdminDB from "../database/adminDB.js";


const AdminController = {

  login: (req, res) => {
    login(req, res);
  },

  getAllAdministradores: async (req, res) => {

    try {
      const cacheKey = "administradores"; // Definir una clave para Redis

      // Verificar si los datos ya están en caché
      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        console.log("Datos obtenidos de la caché");
        return res.json(JSON.parse(cachedData)); // Parsear los datos cacheados
      }

      // Si no hay datos en caché, obtenerlos de la base de datos
      const rows = await AdminDB.getAllAdministradoresDB();

      // Almacenar los resultados en Redis con una expiración de 1 hora (3600 segundos)
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));

      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los administradores:", error);
      res.status(500).json({ error: "Error al obtener los administradores" });
    }
  },

  getAllEmpleados: async (req, res) => {

    try {
      const cacheKey = "empleados"; 
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Datos obtenidos de la caché");
        return res.json(JSON.parse(cachedData));
      }
  
      const rows = await AdminDB.getAllEmpleadosDB();
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows)); // Almacenar en Redis
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los empleados:", error);
      res.status(500).json({ error: "Error al obtener los empleados" });
    }
  },

  getAllClientes: async (req, res) => {

    try {
      const cacheKey = "clientes";
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Datos obtenidos de la caché");
        return res.json(JSON.parse(cachedData));
      }
  
      const rows = await AdminDB.getAllClientesDB();
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows)); 
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los clientes:", error);
      res.status(500).json({ error: "Error al obtener los clientes" });
    }
  },
  
  getAllReclamos: async (req, res) => {
    try {
      const cacheKey = "reclamos"; 
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Datos obtenidos de la caché");
        return res.json(JSON.parse(cachedData));
      }
  
      const rows = await AdminDB.getAllReclamosDB();
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows)); 
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los reclamos:", error);
      res.status(500).json({ error: "Error al obtener los reclamos" });
    }
  },
  
  getAllReclamosTipo: async (req, res) => {
    try {
      const cacheKey = "reclamosTipo"; 
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Datos obtenidos de la caché");
        return res.json(JSON.parse(cachedData));
      }
  
      const rows = await AdminDB.getAllReclamosTipoDB();
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows)); 
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los tipos de reclamos", error);
      res.status(500).json({ error: "Error al obtener los tipos de reclamos" });
    }
  },
  
  getAllOficinas: async (req, res) => {
    try {
      const cacheKey = "oficinas"; 
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Datos obtenidos de la caché");
        return res.json(JSON.parse(cachedData));
      }
  
      const rows = await AdminDB.getAllOficinasDB();
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows)); 
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener las oficinas", error);
      res.status(500).json({ error: "Error al obtener las oficinas" });
    }
  },
  
  getEmpleadosByOficina: async (req, res) => {
    const { idOficina } = req.params; 
    const cacheKey = `empleadosOficina:${idOficina}`; // Clave única por oficina
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log("Datos obtenidos de la caché");
        return res.json(JSON.parse(cachedData));
      }
  
      const rows = await AdminDB.getEmpleadosByOficinaDB(idOficina);
      if (rows.length === 0) {
        return res.status(400).json({ error: "Oficinas sin empleados asignados" });
      }
  
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(rows));
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener los empleados de la oficina", error);
      res
        .status(500)
        .json({ error: "Error al obtener los empleados de la oficina" });
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
        .json({ error: "Falta ingresas la descripción del raclamo" });
    }
    try {
      const [[reclamosTipo]] = await pool.query(
        "SELECT * FROM reclamostipo WHERE descripcion=?",
        [descripcion]
      );
      if (reclamosTipo !== 0) {
        return res
          .status(400)
          .json({
            error: `Ya existe el reclamo tipo ID: ${reclamosTipo.idReclamoTipo} con la descripción: ${descripcion}`,
          });
      }

      const rows = await AdminDB.crearReclamoTipoDB(descripcion, activo);

      res.status(200).json({
        message: "Tipo de reclamo creado con éxito",
        id: rows.insertId,
        descripcion,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Error al crear tipo de reclamo",
          details: error.message,
        });
    }
  },

  actualizarReclamoTipo: async (req, res) => {
    const { idReclamoTipo } = req.params;
    const { descripcion } = req.body;
    
    try {
      const [[reclamoTipo]] = await pool.query(
        "SELECT * FROM reclamostipo WHERE idReclamoTipo=?",
        [idReclamoTipo]
      );
      if (!reclamoTipo) {
        return res
          .status(404)
          .json({ error: "Reclamo a actualizar no encontrado" });
      }
      if (!descripcion) {
        return res
          .status(400)
          .json({ error: "No se envio modificación alguna" });
      }
      await AdminDB.actualizarReclamoTipoDB(idReclamoTipo, descripcion);
      res.status(200).json({
        message: "Actualizacion de reclamo tipo con éxito",
        id: reclamoTipo.id,
        descripcion,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Error al actualizar tipo de reclamo",
          details: error.message,
        });
    }
  },

  borrarReclamoTipo: async (req, res) => {
    const { idReclamoTipo } = req.params;

    try {
      const [[reclamoTipo]] = await pool.query(
        "SELECT * FROM reclamostipo WHERE idReclamoTipo = ?",
        [idReclamoTipo]
      );

      if (!reclamoTipo) {
        return res
          .status(404)
          .json({ error: "Reclamo a eliminar no encontrado" });
      }

      if (reclamoTipo.activo === 0) {
        return res
          .status(400)
          .json({ error: "El reclamo tipo ya estaba desactivado" });
      }

      await AdminDB.borrarReclamoTipoDB(idReclamoTipo);

      res.status(200).json({
        message: "Reclamo tipo desactivado con éxito",
        id: reclamoTipo.idReclamoTipo,
        descripcion: reclamoTipo.descripcion,
      });
    } catch (error) {
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
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 1) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      const [usuario] = await pool.query(
        "SELECT correoElectronico FROM usuarios WHERE correoElectronico=?",
        [correoElectronico]
      );

      if (usuario.length > 0) {
        return res.status(400).json({ error: "El usuario esta cargado." });
      }

      const hashedPassword = await bcrypt.hash(contrasenia, 10);
      const activo = 1;

      const user = {
        nombre,
        apellido,
        correoElectronico,
        contrasenia: hashedPassword,
        idTipoUsuario,
        imagen,
        activo,
      };

      const rows = await AdminDB.crearUsuarioDB(user);

      res.json({
        message: "Usuario creado con éxito",
        id: rows.insertId,
        nombre,
        correoElectronico,
        idTipoUsuario,
      });
    } catch (error) {
      console.error(error);
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

      res.json({
        mensaje: `Se ha modificado un ${tipoUsuario} con éxito.`,
        id: idUsuarioModificado,
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        idTipoUsuario,
        imagen,
        activo,
      });
    } catch (error) {
      console.log(error);
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

      res.json({
        mensaje: `Se ha desactivado el ${tipoUsuario} correctamente.`,
      });
    } catch (error) {
      console.error("Error al borrar el usuario:", error);
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
