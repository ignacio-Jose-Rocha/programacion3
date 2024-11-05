import express from 'express';
import EstadisticasController from '../controllers/estadisticasController.js';


const router = express.Router();

router.get("/estadisticas", EstadisticasController.getEstadisticasCompletas);


export default router;
