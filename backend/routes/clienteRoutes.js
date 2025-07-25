import express from 'express';
import ClienteController from '../controllers/clienteController.js';
import validarCliente from '../middleware/validarCliente.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.post('/', upload.single('imagen'), validarCliente, ClienteController.crearCliente);
router.put('/actualizar/:id', ClienteController.actualizarCliente);

export default router;
