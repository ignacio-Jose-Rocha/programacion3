const pool = require('../config.js');

exports.getAllclientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 1');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

exports.login = async (req, res) => {
  const { correoElectronico, contrasenia } = req.body;
  console.log('Datos recibidos:', correoElectronico, contrasenia);
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM usuarios WHERE correoElectronico = ? AND contrasenia = ?', [correoElectronico, contrasenia]);
    connection.release();
    if (rows.length > 0) {
      res.json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};/*
exports.reclamo=async(req,res)=>{
  const {idUsuario, nombre,idTipoUsuario,idOficina}=req.body;
  
}*/
exports.crearCliente = async (req, res) => {
  const {nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo} = req.body
  try {
    const [usuarios] = await pool.query ("SELECT * FROM usuarios WHERE correoElectronico=? AND nombre=? AND apellido=?" , [correoElectronico, nombre, apellido])   
    if (usuarios.length>0)
    {
      return res.status (400).json({error: 'Los datos ya estan cargados.'})
    }
      const [rows] = await pool.query ("INSERT INTO usuarios SET ? ", {nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo})
      res.json ({id:rows.insertId,nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo})
  }
  catch (error) {
    console.log(error)
      }
}
exports.actualizarCliente = async (req, res) => {
  const {idUsuario} = req.params;
  const {nombre, apellido,correoElectronico, contrasenia,idTipoUsuario,imagen, activo}   = req.body;
  try{
    
    const [rows]=await pool.query("update usuarios set nombre=?, apellido=?, correoElectronico=?, contrasenia=?, idTipoUsuario=?, imagen=?, activo=? where idUsuario=? and  idTipoUsuario = 1",[nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo, idUsuario]);  
    res.json({
      id:idUsuario,
      nombre,
      apellido,
      correoElectronico,
      contrasenia,
      idTipoUsuario,
      imagen,
      activo})
  } 
  catch(error){
    console.log(Error);
}

}