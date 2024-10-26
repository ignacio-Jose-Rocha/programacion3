import express from 'express';
import ReclamoController from '../controllers/reclamoController.js';

const router = express.Router();

// Rutas de Reclamo
router.get('/reclamos/usuario/:idUsuario', ReclamoController.obtenerReclamoId);
router.get('/reclamos/estado/:idCliente', ReclamoController.obtenerReclamoEstado);
router.post('/reclamo', ReclamoController.crearReclamo);
router.put("/:idCliente/reclamos/:idReclamo/cancelar", ReclamoController.cancelarReclamo);
router.get("/reclamos", ReclamoController.getAllReclamos);
router.get("/reclamos/pdf", ReclamoController.descargarReclamosPDF);

export default router;
