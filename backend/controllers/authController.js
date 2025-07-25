import { loginService } from '../services/authService.js';

const AuthController = {
    login: async (req, res) => {
        try {
            const { correoElectronico, contrasenia } = req.body;
            
            if (!correoElectronico || !contrasenia) {
                return res.status(400).json({ 
                    error: "Correo electrónico y contraseña son requeridos" 
                });
            }

            const resultado = await loginService(correoElectronico, contrasenia);
            res.status(200).json(resultado);
        } catch (error) {
            console.error("Error en login:", error);
            res.status(400).json({ error: error.message });
        }
    },

    logout: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en logout:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    register: async (req, res) => {
        try {
            res.status(200).json({ mensaje: "Endpoint en desarrollo" });
        } catch (error) {
            console.error("Error en register:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

export default AuthController;
