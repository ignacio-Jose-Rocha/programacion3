import { getUserByEmail } from "../database/authDB.js";  
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const ultimoTiempo = {}; // Para manejar el tiempo de los intentos de login

const loginService = async (correoElectronico, contrasenia) => {
  const tiempoActual = Date.now();
  const segundos = 60; // Tiempo mínimo entre intentos de login
  const tokenExpiracion = '1h'; // Tiempo de expiración del token

  if (
    ultimoTiempo[correoElectronico] &&
    tiempoActual - ultimoTiempo[correoElectronico] < segundos * 1000
  ) {
    throw new Error("Has iniciado sesión recientemente. Inténtalo de nuevo más tarde.");
  }

  // Llamar a la capa de datos para obtener el usuario por su correo
  const usuario = await getUserByEmail(correoElectronico);
  if (!usuario) {
    throw new Error("Usuario no encontrado");
  }

  // Verificar que el usuario esté activo
  if (usuario.activo == 0) {
    throw new Error("Usuario inactivo");
  }

  // Verificar la contraseña
  let contraseniaCorrecta = false;
  if (
    usuario.contrasenia.startsWith("$2b$") ||
    usuario.contrasenia.startsWith("$2a$")
  ) {
    contraseniaCorrecta = await bcrypt.compare(contrasenia, usuario.contrasenia);
  } else {
    contraseniaCorrecta = usuario.contrasenia === contrasenia;
  }

  if (!contraseniaCorrecta) {
    throw new Error("Correo o contraseña incorrectos");
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
};

export { loginService };
