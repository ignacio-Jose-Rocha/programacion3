import pool from '../config.js';
import { login as authLogin } from './authController.js';
import jwt from 'jsonwebtoken';

let globalIdTipoUsuario;

const AdminController = {
  login: async (req, res) => {
    await authLogin(req, res);
    const token = req.headers['autorizacion'];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (!err) {
          globalIdTipoUsuario = decoded.idTipoUsuario;
          console.log('globalIdTipoUsuario:', globalIdTipoUsuario);
          res.json({ globalIdTipoUsuario });
        } else {
          res.status(500).json({ message: 'Error al verificar el token' });
        }
      });
    } else {  
      res.status(403).json({ message: 'No hay token' });
    }
  },
  getAllAdministradores: async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM usuarios WHERE idTipoUsuario = 1 AND activo = 1 AND idTipoUsuario = ${globalIdTipoUsuario}`);
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },  

  actualizarClienteAdmin: async (req, res) => {
    try {
      const { idUsuarioModificado, idUsuarioModificador } = req.params;
      const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo } = req.body;
    
      let [[usuarioModificador]] = await pool.query(`SELECT * FROM usuarios WHERE idUsuario = ? AND idTipoUsuario = ${globalIdTipoUsuario}`, [idUsuarioModificador]);
      let [[usuarioModificado]] = await pool.query(`SELECT * FROM usuarios WHERE idUsuario = ? AND idTipoUsuario = ${globalIdTipoUsuario}`, [idUsuarioModificado]);
      if (!usuarioModificado) {
        return res.status(404).json({ error: 'Usuario a modificar no encontrado' });
      }
      if (!usuarioModificador) {
        return res.status(404).json({ error: 'Usuario modificador no encontrado' });
      }
      if (usuarioModificador.idTipoUsuario != 1) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operaciÃ³n' });
      }
    
      await pool.query(`UPDATE usuarios SET nombre=?, apellido=?, correoElectronico=?, contrasenia=?, idTipoUsuario=?, imagen=?, activo=? WHERE idUsuario=? AND idTipoUsuario = ${globalIdTipoUsuario}`, [nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo, idUsuarioModificado]);
      res.json({
        id: idUsuarioModificado,
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        idTipoUsuario,
        imagen,
        activo
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
  },
    
  borrarUsuario: async (req, res) => {
    try {
      const { idUsuario } = req.params;
      let [[usuario]] = await pool.query(`SELECT * FROM usuarios WHERE idUsuario = ? AND idTipoUsuario = ${globalIdTipoUsuario}`, [idUsuario]);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario a borrar no encontrado' });
      }
      await pool.query(`UPDATE usuarios SET activo=0 WHERE idUsuario=? AND idTipoUsuario = ${globalIdTipoUsuario}`, [idUsuario]);
      res.json({ mensaje: 'Usuario desactivado correctamente' });
    } catch (error) {
      console.error('Error al borrar el usuario:', error);
      res.status(500).json({ error: 'Error al borrar el usuario' });
    }
  },

  
};

export default AdminController;