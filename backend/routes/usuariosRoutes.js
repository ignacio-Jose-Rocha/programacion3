import express from 'express';
import { getAllclientes, login, actualizarCliente } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/clientes', getAllclientes);
router.get("/clienteLogin", login);
router.put("/actualizarCliente/:idUsuario", actualizarCliente);

export default router;