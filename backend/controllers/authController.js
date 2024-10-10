import pool from "../config.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const ultimoTiempo = {};

const login = async (req, res) => {
  const { correoElectronico, contrasenia } = req.body;
  console.log("Datos recibidos:", correoElectronico, contrasenia);
  try {
    const tiempoActual = Date.now();
    const segundos = 60;
    if (
      ultimoTiempo[correoElectronico] &&
      tiempoActual - ultimoTiempo[correoElectronico] < segundos * 1000
    ) {
      return res.status(429).json({
        success: false,
        message:
          "Ya has iniciado sesión recientemente. Inténtalo de nuevo más tarde.",
      });
    }

    // Primero, buscar el usuario por correo electrónico
<<<<<<< HEAD
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE correoElectronico = ?', [correoElectronico]);
    
=======
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE correoElectronico = ?",
      [correoElectronico]
    );

>>>>>>> 010b4693b48820eb55293515a27ca7538750a10b
    if (rows.length > 0) {
      const usuario = rows[0];

      // Verificar si el usuario está activo
      if(usuario.activo == 0) {
        return res.status(401).json({ success: false, message: 'Usuario inactivo' });
      }

      // Verificar si la contraseña está encriptada o no
      let contraseniaCorrecta = false;

      if (
        usuario.contrasenia.startsWith("$2b$") ||
        usuario.contrasenia.startsWith("$2a$")
      ) {
        // Contraseña encriptada (bcrypt)
        contraseniaCorrecta = await bcrypt.compare(
          contrasenia,
          usuario.contrasenia
        );
      } else {
        // Contraseña en texto claro
        contraseniaCorrecta = usuario.contrasenia === contrasenia;
      }

      if (contraseniaCorrecta) {
        const payload = {
          idTipoUsuario: usuario.idTipoUsuario,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: segundos,
        });

        ultimoTiempo[correoElectronico] = tiempoActual;

        res.json({
          success: true,
          message: "Inicio de sesión exitoso.",
          token,
          usuario: {
            idTipoUsuario: usuario.idTipoUsuario,
          },
        });
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
<<<<<<< HEAD
        console.log('Token descomprimido:', decodedToken);
=======
        console.log("Token descomprimido:", decodedToken);
>>>>>>> 010b4693b48820eb55293515a27ca7538750a10b
        return token;
      } else {
        res
          .status(401)
          .json({ success: false, message: "Correo o contraseña incorrectos" });
      }
    } else {
<<<<<<< HEAD
      res.status(401).json({ success: false, message: 'Correo o contraseña incorrectos' });
      
=======
      res
        .status(401)
        .json({ success: false, message: "Correo o contraseña incorrectos" });
>>>>>>> 010b4693b48820eb55293515a27ca7538750a10b
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

<<<<<<< HEAD
export { login };
=======
export { login };
>>>>>>> 010b4693b48820eb55293515a27ca7538750a10b
