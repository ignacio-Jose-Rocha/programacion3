import pool from '../config.js';

export const getAllclientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 1');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};
export const getAllempleados = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 2');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};
export const getAllAdministradores = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE idTipoUsuario = 3');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
}
export const login = async (req, res) => {
  const { correoElectronico, contrasenia } = req.body;
  console.log('Datos recibidos:', correoElectronico, contrasenia);
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correoElectronico = ? AND contrasenia = ?', [correoElectronico, contrasenia]);
    if (rows.length > 0) {
      let tipoUsuario = '';
      switch (rows[0].idTipoUsuario) {
        case 1:
          tipoUsuario = `'Administrador' {${rows[0].correoElectronico}}`;
          break;
        case 2:
          tipoUsuario = `'Empleado' {${rows[0].correoElectronico}}`;
          break;
        case 3:
          tipoUsuario = `'Cliente' {${rows[0].correoElectronico}}`;
          break;
        default:
          tipoUsuario = 'Desconocido';
      }
      res.json({ success: true, message: `Inicio de sesión exitoso. Usuario: ${tipoUsuario}` });
    } else {
      res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
export const crearCliente = async (req, res) => {
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
};


export const actualizarCliente = async (req, res) => {
  const { idUsuario } = req.params;
  const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo } = req.body;
  try {
    const [rows] = await pool.query(
      'UPDATE usuarios SET nombre=?, apellido=?, correoElectronico=?, contrasenia=?, idTipoUsuario=?, imagen=?, activo=? WHERE idUsuario=? AND idTipoUsuario = 1',
      [nombre, apellido, correoElectronico, contrasenia, idTipoUsuario, imagen, activo, idUsuario]
    );
    res.json({
      id: idUsuario,
      nombre,
      apellido,
      correoElectronico,
      contrasenia,
      idTipoUsuario,
      imagen,
      activo
    });
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
};

