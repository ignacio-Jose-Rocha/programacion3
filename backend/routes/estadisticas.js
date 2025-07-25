import express from 'express';
import EstadisticasController from '../controllers/estadisticasController.js';

const router = express.Router();

router.get('/obtener', EstadisticasController.obtenerEstadisticas);
router.get('/tipo', EstadisticasController.obtenerEstadisticasPorTipo);
router.get('/estado', EstadisticasController.obtenerEstadisticasPorEstado);

export default router;
