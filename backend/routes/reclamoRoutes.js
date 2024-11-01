import express from 'express';
import ReclamoController from '../controllers/reclamoController.js';

const router = express.Router();

// Rutas de Reclamo
router.get('/estado', ReclamoController.obtenerReclamoEstado);
router.post('/reclamo', ReclamoController.crearReclamo);
router.put("/:idReclamo/cancelar", ReclamoController.cancelarReclamo);
router.get("/reclamos", ReclamoController.getAllReclamos); // un cliente no debe poder obtener todos los reclamos
router.get("/reclamos/pdf", ReclamoController.descargarReclamosPDF); // crear una nueva ruta
 
export default router;
