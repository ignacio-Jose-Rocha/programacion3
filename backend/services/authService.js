import { getUserByEmail } from "../database/authDB.js";  
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const ultimoTiempo = {}; // Para manejar el tiempo de los intentos de login

const loginService = async (correoElectronico, contrasenia) => {
  try {
    const tiempoActual = Date.now();
    const segundos = 60; // Tiempo mínimo entre intentos de login
    const tokenExpiracion = '1h'; // Tiempo de expiración del token

    if (
      ultimoTiempo[correoElectronico] &&
      tiempoActual - ultimoTiempo[correoElectronico] < segundos * 1000
    ) {
      return { success: false, status: 429, message: "Has iniciado sesión recientemente. Inténtalo de nuevo más tarde." };
    }

    // Llamar a la capa de datos para obtener el usuario por su correo
    const usuario = await getUserByEmail(correoElectronico);

    if (!usuario) {
      return { success: false, status: 401, message: "Usuario no encontrado" };
    }

    // Verificar que el usuario esté activo
    if (usuario.activo == 0) {
      return { success: false, status: 401, message: "Usuario inactivo" };
    }

    // Verificar la contraseña (si está encriptada o en texto plano)
    let contraseniaCorrecta = false;
    if (
      usuario.contrasenia.startsWith("$2b$") ||
      usuario.contrasenia.startsWith("$2a$")
    ) {
      // Contraseña encriptada
      contraseniaCorrecta = await bcrypt.compare(contrasenia, usuario.contrasenia);
    } else {
      // Contraseña en texto claro
      contraseniaCorrecta = usuario.contrasenia === contrasenia;
    }

    if (!contraseniaCorrecta) {
      return { success: false, status: 401, message: "Correo o contraseña incorrectos" };
    }

    // Crear el token JWT
    const payload = { idTipoUsuario: usuario.idTipoUsuario, idUsuario: usuario.idUsuario };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: tokenExpiracion });

    // Guardar el último tiempo de login
    ultimoTiempo[correoElectronico] = tiempoActual;

    return {
      success: true,
      status: 200,
      message: "Inicio de sesión exitoso.",
      token,
      usuario: {
        idTipoUsuario: usuario.idTipoUsuario,
        idUsuario: usuario.idUsuario,
      }
    };
  } catch (error) {
    console.error("Error en loginService:", error);
    throw new Error("Error al iniciar sesión");
  }
};

export { loginService };
