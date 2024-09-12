import pool from '../config.js';

const reclamoController = {
    getAllreclamos: async (req, res) => {
      try {
          const [rows] = await pool.query('SELECT * FROM reclamos');
          res.json(rows);
      }catch (error) {
          console.error('Error al obtener los usuarios:', error);
          res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
      },

      crearReclamo: async (req, res) => {
        const {asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioCreador, idUsuarioFinalizador} = req.body;
        try {
          const [reclamos] = await pool.query("SELECT * FROM reclamos WHERE idUsuarioCreador=? AND idReclamoTipo=? AND idReclamoEstado=?", [idUsuarioCreador, idReclamoTipo, idReclamoEstado]);
          const [reclamos2] = await pool.query("SELECT idTipoUsuario FROM usuarios where idUsuario=?",[idUsuarioCreador])
          let reclamo = reclamos2[0]
          if (reclamos.length > 0) {
            return res.status(400).json({ error: 'Los datos ya están cargados.' });
          }
          if(reclamo.idTipoUsuario === 3){
            console.log(reclamos2);
            const [rows] = await pool.query("INSERT INTO reclamos SET ?", {asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioCreador, idUsuarioFinalizador});
            res.json({ id: rows.insertId, asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioCreador, idUsuarioFinalizador});
          }
          else{
            return res.status(400).json({ error: "error, tipo de usuario no tiene permitido crear reclamos" });
          }
        }catch (error) {
          console.log(error);
        }
      },

<<<<<<< HEAD
      
=======
    obtenerReclamoId: async (req,res) => {
      const {idUsuario} = req.params;
      console.log(idUsuario);
      try{
        const[rows] = await pool.query('SELECT * FROM reclamos WHERE idUsuarioCreador=?', [idUsuario]);
        console.log(rows);
        res.json(rows)
      }
      catch{
        console.log('error')
      }
    },

>>>>>>> 2780783d743e189f342a74a99f84aa11632159c8
    

}

export default reclamoController;