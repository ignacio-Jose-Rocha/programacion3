import express from 'express';
import { getAllclientes, login, actualizarCliente } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/clientes', getAllclientes);
router.get('/empleados', usuariosController.getAllempleados);
router.get('/administradores', usuariosController.getAllAdministradores);
router.get("/clienteLogin", login);
router.put("/actualizarCliente/:idUsuario", actualizarCliente);
router.post("/crearCliente", usuariosController.crearCliente);

export default router;