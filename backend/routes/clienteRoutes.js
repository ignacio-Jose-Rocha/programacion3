import express from 'express';
import ClienteController from '../controllers/clienteController.js';

const router = express.Router();

// Obtener tipos de reclamos
router.get("/tipos-reclamos", ClienteController.listarTiposReclamos);

// Obtener reclamos por usuario
router.get('/reclamos/usuario/:idUsuario', ClienteController.obtenerReclamoId);
// Obtener el estado de los reclamos
router.get('/reclamos/estado/:idCliente', ClienteController.obtenerReclamoEstado);

// Crear nuevo cliente y reclamo
router.post("/cliente", ClienteController.crearCliente);
router.post('/reclamo', ClienteController.crearReclamo);

// Cancelar reclamo por ID de cliente y reclamo
router.post("/:idCliente/reclamos/:idReclamo/cancelar", ClienteController.cancelarReclamo);

// Actualizar cliente
router.put("/:idUsuario/actualizar", ClienteController.actualizarCliente);


export default router;