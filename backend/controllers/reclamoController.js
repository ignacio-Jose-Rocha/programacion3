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
          const [reclamos] = await pool.query("SELECT * FROM reclamos WHERE idUsuarioCreador=? AND idReclamoTipo=? AND idReclamoEstado=? AND asunto=?", [idUsuarioCreador, idReclamoTipo, idReclamoEstado, asunto]);
          if (reclamos.length > 0) {
            return res.status(400).json({ error: 'Los datos ya están cargados.' });
          }
          const [[reclamo]] = await pool.query("SELECT idTipoUsuario FROM usuarios where idUsuario=?",[idUsuarioCreador])
          console.log(reclamo)
          if(reclamo.idTipoUsuario === 3){
            const [rows] = await pool.query("INSERT INTO reclamos SET ?", {asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioCreador, idUsuarioFinalizador});
            res.json({ id: rows.insertId, asunto, descripcion, fechaCreado, fechaFinalizado, fechaCancelado, idReclamoEstado, idReclamoTipo, idUsuarioCreador, idUsuarioFinalizador});
          }
          else{
            return res.status(400).json({ error: "error, tipo de usuario no tiene permitido crear reclamos" });
          }
        }catch (error) {
          return res.status(400).json({ error: "error al crear reclamo" });
        }
      },

      obtenerReclamoId: async (req,res) => {
        const {idUsuario} = req.params;
        try{
          const[rows] = await pool.query('SELECT * FROM reclamos WHERE idUsuarioCreador=?', [idUsuario]);
          if(rows.length === 0){
            return res.status(400).json({ error: "No se encontro el reclamo" });
          }
          console.log(rows);
          res.json(rows)
        }
        catch{
          return res.status(400).json({ error: "error al obtener tipo de reclamo" });
        }
      },
       
      obtenerReclamoEstado: async (req,res) => {
        const {idCliente} = req.params;
        try{
          const[[rows]] = await pool.query('SELECT idUsuario, idTipoUsuario FROM usuarios WHERE idUsuario = ?', [idCliente]);
          console.log(rows);
          if(rows.length === 0){
            return res.status(400).json({ error: "No se encontro el reclamo" });
          }
          if(rows.idTipoUsuario != 3){
            return res.status(400).json({ error: "Usuario no es de tipo cliente" });
          }
       

          const[[reclamo]] = await pool.query('SELECT idReclamoEstado FROM reclamos where idUsuarioCreador=?', [idCliente])

          if (!reclamo) {
            return res.status(400).json({ error: "No se encontró ningún reclamo para este cliente" });
          }

          const estadoReclamo = {
            1: "Creado",
            2: "En proceso",
            3: "Cancelado",
            4: "Finalizado"
          };

          const estadoDescripcion = estadoReclamo[reclamo.idReclamoEstado] || "Estado desconocido";
          res.json({
            idCliente: idCliente,
            estadoReclamo: estadoDescripcion
          });
          console.log(reclamo);
        }
        catch{
          return res.status(400).json({ error: "error al obtener tipo de reclamo" });
        }
      },
        

}

export default reclamoController;