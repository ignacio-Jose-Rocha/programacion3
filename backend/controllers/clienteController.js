import bcrypt from 'bcrypt';
import { login } from './authController.js';
import ClienteDB from '../database/clienteDB.js';

const ClienteController = {
  login: (req, res) => {
    login(req, res);
  },


  crearCliente: async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia, imagen } = req.body;

    if (!nombre || !apellido || !correoElectronico || !contrasenia) {
      const errores = [];
      if (!nombre) errores.push("nombre");
      if (!apellido) errores.push("apellido");
      if (!correoElectronico) errores.push("correoElectronico");
      if (!contrasenia) errores.push("contraseña");

      return res.status(400).json({ error: `Faltan los siguientes datos requeridos: ${errores.join(', ')}` });
    }

    const idTipoUsuario = 3;
    const activo = 1;

    try {
      const usuarios = await ClienteDB.buscarUsuarioDB(correoElectronico, nombre, apellido);
      if (usuarios.length > 0) {
        return res.status(400).json({ error: 'Los datos ya están cargados.' });
      }

      const hashedPassword = await bcrypt.hash(contrasenia, 10);

      const idUsuario = await ClienteDB.crearUsuarioDB({
        nombre,
        apellido,
        correoElectronico,
        contrasenia: hashedPassword,
        idTipoUsuario,
        imagen,
        activo
      });

      res.status(200).json({
        message: "Cliente creado con éxito",
        id: idUsuario,
        nombre,
        apellido,
        correoElectronico,
        contrasenia: hashedPassword,
        idTipoUsuario,
        imagen,
        activo
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el cliente', details: error.message });
    }
  },

  crearReclamo: async (req, res) => {
    const { asunto, descripcion, idUsuarioCreador, idReclamoTipo } = req.body;

    if (!asunto || !descripcion) {
      return res.status(400).json({ error: 'Asunto y descripción son obligatorios.' });
    }
    if (!idReclamoTipo) {
      return res.status(400).json({ error: 'Es necesario enviar el tipo de reclamo.' });
    }

    const fechaCreado = new Date();

    try {
      const { existeReclamo, idTipoUsuario } = await ClienteDB.buscarReclamoPorUsuarioYAsuntoDB(idUsuarioCreador, asunto);

      if (existeReclamo > 0) {
        return res.status(400).json({ error: 'Este reclamo ya existe.' });
      }

      if (idTipoUsuario === 3) {
        const idReclamoEstado = 1;
        const idReclamo = await ClienteDB.crearReclamoDB({
          asunto,
          descripcion,
          fechaCreado,
          idReclamoEstado,
          idReclamoTipo,
          idUsuarioCreador
        });

        res.json({
          id: idReclamo,
          asunto,
          descripcion,
          fechaCreado,
          idReclamoEstado,
          idReclamoTipo,
          idUsuarioCreador
        });
      } else {
        return res.status(400).json({ error: "Este usuario no tiene permiso para crear reclamos." });
      }
    } catch (error) {
      console.error('Error al crear reclamo:', error);
      return res.status(500).json({ error: "Error al crear reclamo" });
    }
  },

  listarTiposReclamos: async (req, res) => {
    try {
      const [tiposReclamos] = await ClienteDB.obtenerTiposDeReclamosDB();
      res.json(tiposReclamos);
    } catch (error) {
      console.error('Error al listar tipos de reclamos:', error);
      return res.status(500).json({ error: "Error al listar tipos de reclamos" });
    }
  },

  cancelarReclamo: async (req, res) => {
    const { idCliente, idReclamo } = req.params;
    try {
      const [[reclamo]] = await ClienteDB.buscarReclamoPorIdDB(idCliente, idReclamo);
      console.log(reclamo)
      if (!reclamo) {
        return res.status(400).json({ error: "No se encontro el reclamo" });
      }
      if (reclamo.idReclamoEstado === 3) {
        return res.status(400).json({ error: "Su reclamo ya ha sido cancelado" });
      }
      if (reclamo.idReclamoEstado !== 1) {
        return res.status(400).json({ error: "Su reclamo ya esta siendo atendido, no puede ser cancelado" });
      }
      await ClienteDB.cancelarReclamoDB(idCliente, idReclamo)
      res.status(200).json({ message: "Reclamo cancelado con éxito" });
    }
    catch (error) {
      console.error('Error al cancelar reclamo:', error);
      res.status(500).json({ error: "Error al cancelar reclamo" });
    }
  },

  obtenerReclamoId: async (req, res) => {
    const { idUsuario } = req.params;
    try {
      const [rows] = await ClienteDB.obtenerReclamosPorUsuarioDB(idUsuario)

      if (rows.length === 0) {
        return res.status(404).json({ error: "No se encontró el reclamo" });
      }

      res.status(200).json({ message: "Reclamos encontrados", reclamos: rows });
    }
    catch (error) {
      console.error('Error al obtener reclamos:', error);
      return res.status(500).json({ error: "Error al obtener reclamos" });
    }
  },

  obtenerReclamoEstado: async (req, res) => {
    const { idCliente } = req.params;
    try {
      const [[usuario]] = await ClienteDB.obtenerUsuarioPorIdDB(idCliente)
      if (!usuario || !usuario.idTipoUsuario) {
        return res.status(404).json({ error: "No se encontró el cliente" });
      }
      if (usuario.idTipoUsuario !== 3) {
        return res.status(404).json({ error: "Usuario no es de tipo cliente" });
      }


      const [reclamos] = await ClienteDB.obtenerReclamosPorUsuarioDB(idCliente);
      if (reclamos.length === 0) {
        return res.status(404).json({ error: "No se encontró ningún reclamo para este cliente" });
      }

      const estadoReclamo = {
        1: "Creado",
        2: "En proceso",
        3: "Cancelado",
        4: "Finalizado"
      };

      const reclamoEstado = reclamos.map(reclamo => ({
        idReclamo: reclamo.idReclamo,
        asunto: reclamo.asunto,
        estado: estadoReclamo[reclamo.idReclamoEstado] || "Estado desconocido"
      }));

      res.status(200).json({
        idCliente: idCliente,
        reclamos: reclamoEstado,
        message: "Reclamos obtenidos exitosamente"
      });
    }
    catch {
      return res.status(500).json({ error: "error al obtener tipo de reclamo" });
    }
  },

  actualizarCliente: async (req, res) => {
    const { idCliente } = req.params;
    const { nombre, apellido, correoElectronico, contrasenia, imagen } = req.body;
    try {
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 3) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      if (!nombre && !apellido && !correoElectronico && !contrasenia && !imagen) {
        return res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
      }

      // Verifica si el usuario existe y es activo
      const [[user]] = await ClienteDB.buscarUsuarioActivoPorIdDB(idCliente)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado o está inactivo' });
      }

      if (user.idTipoUsuario != 3) {
        return res.status(403).json({ error: 'No tienes permisos para realizar esta operación' });
      }

      const camposActualizar = [];
      const valoresActualizar = [];

      if (nombre) {
        camposActualizar.push("nombre=?");
        valoresActualizar.push(nombre);
      }
      if (apellido) {
        camposActualizar.push("apellido=?");
        valoresActualizar.push(apellido);
      }
      if (correoElectronico) {
        camposActualizar.push("correoElectronico=?");
        valoresActualizar.push(correoElectronico);
      }
      if (contrasenia) {
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        camposActualizar.push("contrasenia=?");
        valoresActualizar.push(hashedPassword);
      }
      if (imagen) {
        camposActualizar.push("imagen=?");
        valoresActualizar.push(imagen);
      }

      if (camposActualizar.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
      }

      await ClienteDB.actualizarUsuarioDB(idCliente, camposActualizar, valoresActualizar);

      res.json({
        id: idcLIENTE,
        nombre,
        apellido,
        correoElectronico,
        imagen
      });
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
      res.status(500).json({ mensaje: "Error al actualizar el cliente" });
    }
  }
};

export default ClienteController;