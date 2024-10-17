import { loginService } from "../services/authService.js";

const login = async (req, res) => {
  const { correoElectronico, contrasenia } = req.body;
  
  try {
    const resultado = await loginService(correoElectronico, contrasenia);

    // Enviar la respuesta según el resultado del servicio
    return res.status(resultado.status).json({
      success: resultado.success,
      message: resultado.message,
      token: resultado.token || null,
      usuario: resultado.usuario || null
    });

  } catch (error) {
    console.error("Error en authController:", error);
    res.status(500).json({ success: false, message: "Error al iniciar sesión" });
  }
};

export { login };
