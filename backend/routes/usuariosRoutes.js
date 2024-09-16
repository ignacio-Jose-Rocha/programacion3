import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/clientes', UsuarioController.getAllclientes);
router.get('/empleados', UsuarioController.getAllempleados);
router.get('/administradores', UsuarioController.getAllAdministradores);
router.get("/clienteLogin", UsuarioController.login);
router.put("/actualizarCliente/:idUsuario", UsuarioController.actualizarCliente);
router.put("/actualizarClienteAdmin/:idUsuarioModificado/:idUsuarioModificador", UsuarioController.actualizarClienteAdmin);
router.post("/crearCliente", UsuarioController.crearCliente);
router.post("/borrarUsuario/:idUsuario", UsuarioController.borrarUsuario);


export default router;