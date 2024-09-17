import pool from '../config.js';

const ClienteController = {
  login: (req, res) => {
    login(req, res);
  },

  getAllclientes: async (req, res) => {
      try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 3 and activo = 1');
        res.json(rows);
      }catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
      }
  },
    
  crearCliente: async (req, res) => {
    const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo } = req.body;
    try {
      const [usuarios] = await pool.query("SELECT * FROM usuarios WHERE correoElectronico=? AND nombre=? AND apellido=?", [correoElectronico, nombre, apellido]);
      if (usuarios.length > 0) {
        return res.status(400).json({ error: 'Los datos ya están cargados.' });
      }
      const [rows] = await pool.query("INSERT INTO usuarios SET ?", { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo });
      res.json({ id: rows.insertId, nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo });
    } catch (error) {
      console.log(error);
    }
  },

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

  cancelarReclamo: async (req, res) => {
    const{idCliente, idReclamo} = req.params;
    try{
      const [[reclamo]] = await pool.query("SELECT * FROM reclamos WHERE idUsuarioCreador=? AND idReclamo=?", [idCliente, idReclamo]);
      console.log(reclamo)
      if(!reclamo){
        return res.status(400).json({ error: "No se encontro el reclamo" });
      }
      if(reclamo.idReclamoEstado === 3){
        return res.status(400).json({ error: "Su reclamo ya ha sido cancelado" });
      }
      await pool.query("UPDATE reclamos SET idReclamoEstado=3 where idUsuarioCreador = ? AND idReclamo=?",[idCliente, idReclamo]);
      res.status(200).json("reclamo cancelado con exito")
    }
    catch(error){
      return res.status(400).json({ error: "Error al cancelar reclamo" });
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
      if(!rows){
        return res.status(400).json({ error: "No se encontro el reclamo" });
      }
      if(rows.idTipoUsuario != 3){
        return res.status(400).json({ error: "Usuario no es de tipo cliente" });
      }
       
      const[reclamos] = await pool.query('SELECT idReclamo, asunto, idReclamoEstado FROM reclamos where idUsuarioCreador=?', [idCliente])
      if (reclamos.length === 0) {
        return res.status(400).json({ error: "No se encontró ningún reclamo para este cliente" });
      }

      const estadoReclamo = {
        1: "Creado",
        2: "En proceso",
        3: "Cancelado",
        4: "Finalizado"
      };

      const reclamoEstado = reclamos.map(reclamos => ({
        idReclamo: reclamos.idReclamo,
        asunto: reclamos.asunto,
        estado: estadoReclamo[reclamos.idReclamoEstado] || "Estado desconocido"
      }));

      console.log(reclamos);
      res.json({
        idCliente: idCliente,
        reclamos: reclamoEstado
      });
    }
    catch{
      return res.status(400).json({ error: "error al obtener tipo de reclamo" });
    }
  },

  actualizarCliente: async (req, res) => {
    try {
      const { idUsuario } = req.params;
      const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen} = req.body; 
      let [[user]] = await pool.query('SELECT * FROM usuarios WHERE idUsuario = ? and activo = 1', [idUsuario]);
      console.log(user)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado o está inactivo' });
      }
      if (user.idTipoUsuario != 3) {
        return res.status(400).json({ error: 'No tienes permisos para realizar esta operación' });
      }
      await pool.query("UPDATE usuarios SET nombre=?, apellido=?, correoElectronico=?, contrasenia=?, idTipoUsuario=?, imagen=? WHERE idUsuario=? AND idTipoUsuario = 3", [nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, idUsuario]);
      res.json({
        id: idUsuario,
        nombre,
        apellido,
        correoElectronico,
        contrasenia,
        idTipoUsuario,
        imagen
      });
    }catch (error) {
      console.log(error);
      res.status(500).json({ mensaje: "Error al actualizar el cliente" });
    }
  },
};

export default ClienteController;