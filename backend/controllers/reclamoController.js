import pool from '../config.js';

const reclamoController = {
    getAllreclamos: async (req, res) => {
        try {
          const [rows] = await pool.query('SELECT * FROM reclamos');
          res.json(rows);
        } catch (error) {
          console.error('Error al obtener los usuarios:', error);
          res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
      },

      crearReclamo: async (req, res) => {
        const {asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioCreador, idUsuarioFinalizador} = req.body;
        try {
          const [reclamos] = await pool.query("SELECT * FROM reclamos WHERE idUsuarioCreador=? AND idReclamoTipo=? AND idReclamoEstado=?", [idUsuarioCreador, idReclamoTipo, idReclamoEstado]);
          if (reclamos.length > 0) {
            return res.status(400).json({ error: 'Los datos ya están cargados.' });
          }
          const [rows] = await pool.query("INSERT INTO reclamos SET ?", {asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioCreador, idUsuarioFinalizador});
          res.json({ id: rows.insertId, asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioCreador, idUsuarioFinalizador});
        } catch (error) {
          console.log(error);
        }
      },

      cancelar
    

}

export default reclamoController;