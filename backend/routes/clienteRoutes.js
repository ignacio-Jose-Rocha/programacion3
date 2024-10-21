import express from 'express';
import ClienteController from '../controllers/clienteController.js';

const router = express.Router();

// Rutas de Cliente
router.post("/cliente", ClienteController.crearCliente);
router.put("/:idUsuario/actualizar", ClienteController.actualizarCliente);

export default router;