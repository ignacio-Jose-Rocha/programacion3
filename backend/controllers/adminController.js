import pool from '../config.js';
import { login } from './authController.js';
import bcrypt from 'bcrypt';

const AdminController = {
  login: (req, res) => {
    login(req, res);
  },
  getAllAdministradores: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 1 and activo = 1');
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },

  actualizarUsuario: async (req, res) => {
    try {
      const { idUsuarioModificado, idUsuarioModificador } = req.params;
      let { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo } = req.body;

      const [[[usuarioModificador]], [[usuarioModificado]]] = await Promise.all([
        pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuarioModificador]),
        pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuarioModificado])
      ]);

      if (!usuarioModificado) {
        return res.status(404).json({ error: 'Usuario a modificar no encontrado' });
      }
      if (!usuarioModificador) {
        return res.status(404).json({ error: 'Usuario modificador no encontrado' });
      }
      if (usuarioModificador.idTipoUsuario != 1) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }

      // Encriptar contraseña si existe
      if (contrasenia) {
        const salt = await bcrypt.genSalt(10);
        contrasenia = await bcrypt.hash(contrasenia, salt);
      }

      // Actualizar solo los campos que se envían en el cuerpo de la solicitud
      const camposAActualizar = [];
      const valores = [];

      if (nombre) camposAActualizar.push('nombre = ?'), valores.push(nombre);
      if (apellido) camposAActualizar.push('apellido = ?'), valores.push(apellido);
      if (correoElectronico) camposAActualizar.push('correoElectronico = ?'), valores.push(correoElectronico);
      if (contrasenia) camposAActualizar.push('contrasenia = ?'), valores.push(contrasenia);
      if (idTipoUsuario) camposAActualizar.push('idTipoUsuario = ?'), valores.push(idTipoUsuario);
      if (imagen) camposAActualizar.push('imagen = ?'), valores.push(imagen);
      if (typeof activo !== 'undefined') camposAActualizar.push('activo = ?'), valores.push(activo);

      if (camposAActualizar.length > 0) {
        const query = `UPDATE usuarios SET ${camposAActualizar.join(', ')} WHERE idUsuario = ?`;
        valores.push(idUsuarioModificado);
        await pool.query(query, valores);
      }
      else {
        return res.status(400).json({ mensaje: 'No hay datos a modificar.' });
      }

      let tipoUsuario;
      if (usuarioModificado.idTipoUsuario === 3) {
        tipoUsuario = 'cliente';
      } 
      else if (usuarioModificado.idTipoUsuario === 2) {
        tipoUsuario = 'empleado';
      }
      else {
        tipoUsuario = 'usuario';
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
      let [[usuario]] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ?', [idUsuario])
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario a borrar no encontrado' });
      }

      if(usuario.activo === 0){
        return res.status(400).json({ mensaje: 'El usuario ya estaba desactivado' });
      }

      await pool.query("UPDATE usuarios SET activo = 0 WHERE idUsuario = ?", [idUsuario]);

      let tipoUsuario;
      if (usuario.idTipoUsuario === 3) {
        tipoUsuario = 'cliente';
      } 
      else if (usuario.idTipoUsuario === 2) {
        tipoUsuario = 'empleado';
      } 
      else {
        tipoUsuario = 'usuario';
      }

      res.json({ mensaje: `Se ha desactivado el ${tipoUsuario} correctamente.` });
    }
    catch (error) {
      console.error('Error al borrar el usuario:', error);
      res.status(500).json({ error: 'Error al borrar el usuario' });
    }
  }
}

export default AdminController;