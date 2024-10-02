import pool from '../config.js';
import bcrypt from 'bcrypt';
import { login as loginFunc } from './authController.js';
import jwt from 'jsonwebtoken';

let tokenD;

const login = async (req, res) => {
  tokenD = await loginFunc(req, res);
};

const ClienteController = {
  login,


  crearCliente: async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia, imagen } = req.body;
    if (!tokenD) {
      return res.status(401).json({ error: 'Debe iniciar sesión primero' });
    }
    if (!nombre || !apellido || !correoElectronico || !contrasenia) {
      const errores = [];
      if (!nombre) errores.push("nombre");
      if (!apellido) errores.push("apellido");
      if (!correoElectronico) errores.push("correoElectronico");
      if (!contrasenia) errores.push("contraseña");

      return res.status(400).json({ error: `Faltan los siguientes datos requeridos: ${errores.join(', ')}` });
    }

    const idTipoUsuario = 3; //por defecto va a ser de tipo cliente
    const activo = 1;

    try {
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 3) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      const [usuarios] = await pool.query("SELECT * FROM usuarios WHERE correoElectronico=? AND nombre=? AND apellido=?", [correoElectronico, nombre, apellido]);
      if (usuarios.length > 0) {
        return res.status(400).json({ error: 'Los datos ya están cargados.' });
      }

      const hashedPassword = await bcrypt.hash(contrasenia, 10); //encriptar contraseña

      const [rows] = await pool.query("INSERT INTO usuarios SET ?",
        {
          nombre,
          apellido,
          correoElectronico,
          contrasenia: hashedPassword,
          idTipoUsuario,
          imagen,
          activo
        });

      res.status(200).json
        ({
          message: "Cliente creado con éxito",
          id: rows.insertId,
          nombre,
          apellido,
          correoElectronico,
          contrasenia: hashedPassword,
          idTipoUsuario,
          imagen,
          activo
        });

    }
    catch (error) {
      res.status(500).json({ error: 'Error al crear el cliente', details: error.message });
    }
  },

  //ver el tema del jsonwebtoken para que no tenga que enviar el idUsuarioCreador y sea automatico
  crearReclamo: async (req, res) => {
    const { asunto, descripcion, idUsuarioCreador } = req.body;
    if (!tokenD) {
      return res.status(401).json({ error: 'Debe iniciar sesión primero' });
    }
    if (!asunto || !descripcion) {
      return res.status(400).json({ error: 'Asunto y descripción son obligatorios.' });
    }

    const fechaCreado = new Date();

    try {
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 3) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      const [result] = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM reclamos WHERE idUsuarioCreador=? AND asunto=?) AS existeReclamo,
                (SELECT idTipoUsuario FROM usuarios WHERE idUsuario=?) AS idTipoUsuario
        `, [idUsuarioCreador, asunto, idUsuarioCreador]);

      const { existeReclamo, idTipoUsuario } = result[0];

      if (existeReclamo > 0) {
        return res.status(400).json({ error: 'Este reclamo ya existe.' });
      }

      if (idTipoUsuario === 3) {  
        const idReclamoEstado = 1;  

        // Obtener el idReclamoTipo desde el front 
        const { idReclamoTipo } = req.body; // El cliente selecciona el tipo de reclamo
        if(!idReclamoTipo){
          return res.status(400).json({ error: 'Es necesario enviar el tipo de reclamo.' });
        }

        const [rows] = await pool.query("INSERT INTO reclamos SET ?", {
          asunto,
          descripcion,
          fechaCreado,
          idReclamoEstado,
          idReclamoTipo,
          idUsuarioCreador
        });

        res.json({
          id: rows.insertId,
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
    if (!tokenD) {
      return res.status(401).json({ error: 'Debe iniciar sesión primero' });
    }
    try {
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 3) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      const [tiposReclamos] = await pool.query("SELECT idReclamosTipo, descripcion FROM reclamos_tipo WHERE activo = 1");
      res.json(tiposReclamos);
    } catch (error) {
      console.error('Error al listar tipos de reclamos:', error);
      return res.status(500).json({ error: "Error al listar tipos de reclamos" });
    }
  },

  cancelarReclamo: async (req, res) => {
    const { idCliente, idReclamo } = req.params;
    if (!tokenD) {
      return res.status(401).json({ error: 'Debe iniciar sesión primero' });
    }
    try {
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 3) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      const [[reclamo]] = await pool.query("SELECT * FROM reclamos WHERE idUsuarioCreador=? AND idReclamo=?", [idCliente, idReclamo]);
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
      await pool.query("UPDATE reclamos SET idReclamoEstado=3 where idUsuarioCreador = ? AND idReclamo=?", [idCliente, idReclamo]);
      res.status(200).json({ message: "Reclamo cancelado con éxito" });
    }
    catch (error) {
      console.error('Error al cancelar reclamo:', error);
      res.status(500).json({ error: "Error al cancelar reclamo" });
    }
  },

  obtenerReclamoId: async (req, res) => {
    const { idUsuario } = req.params;
    if (!tokenD) {
      return res.status(401).json({ error: 'Debe iniciar sesión primero' });
    }
    try {
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 3) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      const [rows] = await pool.query('SELECT * FROM reclamos WHERE idUsuarioCreador=?', [idUsuario]);

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
    if (!tokenD) {
      return res.status(401).json({ error: 'Debe iniciar sesión primero' });
    }
    try {
      const decodedToken = jwt.verify(tokenD, process.env.JWT_SECRET);
      console.log(decodedToken.idTipoUsuario);
      if(decodedToken.idTipoUsuario != 3) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      const [[usuario]] = await pool.query('SELECT idUsuario, idTipoUsuario FROM usuarios WHERE idUsuario = ?', [idCliente]);
      if (!usuario || !usuario.idTipoUsuario) {
        return res.status(404).json({ error: "No se encontró el cliente" });
      }
      if (usuario.idTipoUsuario !== 3) {
        return res.status(404).json({ error: "Usuario no es de tipo cliente" });
      }


      const [reclamos] = await pool.query('SELECT idReclamo, asunto, idReclamoEstado FROM reclamos where idUsuarioCreador=?', [idCliente])
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
    const { idUsuario } = req.params;
    const { nombre, apellido, correoElectronico, contrasenia, imagen } = req.body;
    if (!tokenD) {
      return res.status(401).json({ error: 'Debe iniciar sesión primero' });
    }
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
      const [[user]] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ? AND activo = 1', [idUsuario]);
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

      const query = `UPDATE usuarios SET ${camposActualizar.join(', ')} WHERE idUsuario=? AND idTipoUsuario = 3`;
      valoresActualizar.push(idUsuario);
      await pool.query(query, valoresActualizar);

      res.json({
        id: idUsuario,
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