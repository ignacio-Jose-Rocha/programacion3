import express from 'express';
import ClienteController from '../controllers/clienteController.js';
import passport from 'passport';
import autorizarUsuario from '../middleware/autorizarUsuario.js';
import validarCampos from '../middleware/validarCampos.js';

const router = express.Router();

// Rutas de Cliente
router.post(
    '/cliente/crear',
    validarCampos, 
    ClienteController.crearCliente
  );

router.put(
    "/actualizar", 
    passport.authenticate('jwt', { session: false }), // Validación de token JWT
    autorizarUsuario([3]), 
    ClienteController.actualizarCliente
);

export default router;