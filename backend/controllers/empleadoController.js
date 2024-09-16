import pool from '../config.js';
import dotenv from 'dotenv';
dotenv.config();
import { login } from './authController.js';

const EmpleadoController = {
    login: (req, res) => {
        login(req, res);
    },
    
    getAllEmpleados: async (req, res) => {
        try {
          const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 2 and activo = 1');
          res.json(rows);
        }catch (error) {
          console.error('Error al obtener los usuarios:', error);
          res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
    },

    ActualizarEstadoReclamo: async (req, res) =>{
        const estadoReclamo = {
          1: "Creado",
          2: "En proceso",
          3: "Cancelado",
          4: "Finalizado"
        };
    
        const { idCliente, nuevoEstado } = req.params;
        const estadoNumerico = parseInt(nuevoEstado, 10);
    
          if (!estadoReclamo[estadoNumerico]) {
            return res.status(400).json({ error: "El estado proporcionado no es válido. Debe ser un número entre 1 y 4." });
          }
          console.log(estadoReclamo[estadoNumerico]);
    
        try{
          const [resultado] = await pool.query('UPDATE reclamos SET idReclamoEstado = ? WHERE idUsuarioCreador = ?', [nuevoEstado, idCliente]);
          if (resultado.affectedRows === 0) {
            return res.status(400).json({ error: "No se encontró el reclamo para este usuario" });
          }
          res.json({ mensaje: 'Reclamo estado modificado éxitosamente' });
    
          //const [[usuario]] = await pool.query('SELECT email FROM usuarios WHERE idUsuario = ?', [idCliente]);
    
          //if (!usuario) {
            //return res.status(400).json({ error: "No se encontró el usuario" });
          //}
    
          //const estadoDescripcion = estadoReclamo[nuevoEstado] || "Estado desconocido";
    
          //await enviarNotificacionReclamo(usuario.email, estadoDescripcion);
        }
        catch(error){
          res.status(500).json({ error: 'Error al modificar estado' });
        }
    }
    
}

export default EmpleadoController;