import pool from '../config.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ultimoTiempo = {};

const login = async (req, res) => {
    const { correoElectronico, contrasenia } = req.body;
    console.log('Datos recibidos:', correoElectronico, contrasenia);
    try {
      const tiempoActual = Date.now();
      const segundos = 60000;
      if (ultimoTiempo[correoElectronico] && (tiempoActual - ultimoTiempo[correoElectronico]) < (segundos)) {
        return res.status(429).json({ 
          success: false, 
          message: 'Ya has iniciado sesión recientemente. Inténtalo de nuevo más tarde.' 
        });
      }

      const [rows] = await pool.query('SELECT * FROM usuarios WHERE correoElectronico = ? AND contrasenia = ?', [correoElectronico, contrasenia]);

      if (rows.length > 0) {
        const usuario = rows[0];
        const payload = {
          nombre: usuario.nombre,
          idTipoUsuario: usuario.idTipoUsuario
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: segundos });

        ultimoTiempo[correoElectronico] = tiempoActual;

        res.json({
          success: true,
          message: 'Inicio de sesión exitoso.',
          token,
          usuario: {
            nombre: usuario.nombre,
            idTipoUsuario: usuario.idTipoUsuario,
            correoElectronico: usuario.correoElectronico
          }
        });
      } else {
        res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
      }
    }catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}

export {login};