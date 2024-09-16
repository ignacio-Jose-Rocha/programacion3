import express from 'express';
import ClienteController from '../controllers/clienteController.js';

const router = express.Router();

router.get('/clientes', ClienteController.getAllclientes);
router.get("/clienteLogin", ClienteController.login);
router.put("/actualizarCliente/:idUsuario", ClienteController.actualizarCliente);
router.post("/crearCliente", ClienteController.crearCliente);
router.get('/obtenerReclamos', ClienteController.getAllreclamos);
router.post('/crearReclamo', ClienteController.crearReclamo);
router.get('/obtenerReclamo/:idUsuario', ClienteController.obtenerReclamoId);
router.get('/obtenerReclamoEstado/:idCliente', ClienteController.obtenerReclamoEstado);


export default router;