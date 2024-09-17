import pool from '../config.js';
import { login } from './authController.js';

const AdminController = {
  login: (req, res) => {
    login(req, res);
  },
  getAllAdministradores: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 1 and activo = 1');
      res.json(rows);
    }catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },

  actualizarClienteAdmin: async (req, res) => {
    try {
      const { idUsuarioModificado, idUsuarioModificador } = req.params;
      const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo } = req.body;
    
      let [[usuarioModificador]] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuarioModificador]);
      let [[usuarioModificado]] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuarioModificado]);
      if(!usuarioModificado){
        return res.status(404).json({ error: 'Usuario a modificar no encontrado' });
      }
      if(!usuarioModificador){
        return res.status(404).json({ error: 'Usuario modificador no encontrado' });
      }
      if (usuarioModificador.idTipoUsuario != 1) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
    
      await pool.query("UPDATE usuarios SET nombre=?, apellido=?, correoElectronico=?, contrasenia=?, idTipoUsuario=?, imagen=?, activo=? WHERE idUsuario=?", [nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo, idUsuarioModificado]);
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
    }catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error al actualizar el usuario" });
    }
  },
    
  borrarUsuario: async (req, res) => {
    try{
      const {idUsuario} = req.params;
      let [[usuario]] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuario])
      if(!usuario){
        return res.status(404).json({ error: 'Usuario a borrar no encontrado' });
      }
      await pool.query("UPDATE usuarios SET activo=0 WHERE idUsuario=?", [idUsuario]);
      res.json({ mensaje: 'Usuario desactivado correctamente' });
    }
    catch (error){
      console.error('Error al borrar el usuario:', error);
      res.status(500).json({ error: 'Error al borrar el usuario' });
    }
  }
};

export default AdminController;