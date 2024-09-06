import express from 'express';
import { getAllclientes, login, actualizarCliente, getAllempleados, getAllAdministradores, crearCliente } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/clientes', getAllclientes);
router.get('/empleados', getAllempleados);
router.get('/administradores', getAllAdministradores);
router.get("/clienteLogin", login);
router.put("/actualizarCliente/:idUsuario", actualizarCliente);
router.post("/crearCliente", crearCliente);

export default router;