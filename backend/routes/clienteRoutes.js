import express from 'express';
import ClienteController from '../controllers/clienteController.js';

const router = express.Router();

router.get('/clientes', ClienteController.getAllclientes);
router.get("/clienteLogin", ClienteController.login);
router.put("/actualizarCliente/:idUsuario", ClienteController.actualizarCliente);
router.post("/crearCliente", ClienteController.crearCliente);
router.post("/cancelarReclamo/:idCliente/:idReclamo", ClienteController.cancelarReclamo);
router.get('/obtenerReclamos', ClienteController.getAllreclamos); // deberia estar en admin
router.post('/crearReclamo', ClienteController.crearReclamo);
router.get('/obtenerReclamo/:idUsuario', ClienteController.obtenerReclamoId);
router.get('/obtenerReclamoEstado/:idCliente', ClienteController.obtenerReclamoEstado);


export default router;