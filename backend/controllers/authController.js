import { loginService } from '../services/authService.js';
import ClienteService from '../services/clienteService.js';

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
            // En JWT no hay logout del lado del servidor, solo del cliente
            res.status(200).json({ 
                success: true,
                message: "Logout exitoso. Elimina el token del cliente." 
            });
        } catch (error) {
            console.error("Error en logout:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    register: async (req, res) => {
        try {
            const { nombre, apellido, correoElectronico, contrasenia, idTipoUsuario } = req.body;
            
            if (!nombre || !apellido || !correoElectronico || !contrasenia) {
                return res.status(400).json({ 
                    error: "Todos los campos son requeridos" 
                });
            }

            // Solo admin puede registrar empleados/admins
            if (idTipoUsuario && idTipoUsuario !== 3) {
                if (!req.user || req.user.idTipoUsuario !== 1) {
                    return res.status(403).json({ error: "No autorizado" });
                }
            }

            const tipoUsuario = idTipoUsuario || 3; // Por defecto cliente
            const resultado = await ClienteService.crearCliente(nombre, apellido, correoElectronico, contrasenia, null);
            
            res.status(201).json({
                success: true,
                message: "Usuario registrado exitosamente",
                data: resultado
            });
        } catch (error) {
            console.error("Error en register:", error);
            res.status(400).json({ error: error.message });
        }
    }
};

export default AuthController;
