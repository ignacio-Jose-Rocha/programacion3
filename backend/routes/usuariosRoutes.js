import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/clientes', UsuarioController.getAllclientes);
router.get('/empleados', UsuarioController.getAllempleados);
router.get('/administradores', UsuarioController.getAllAdministradores);
router.get("/clienteLogin", UsuarioController.login);
router.put("/actualizarCliente/:idUsuario", UsuarioController.actualizarCliente);
router.post("/crearCliente", UsuarioController.crearCliente);

export default router;