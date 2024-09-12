import express from 'express';
import reclamosController from '../controllers/reclamoController.js';

const router = express.Router();

router.get('/obtenerReclamos', reclamosController.getAllreclamos);
router.post('/crearReclamo', reclamosController.crearReclamo);
router.get('/obtenerReclamo/:idUsuario', reclamosController.obtenerReclamoId);


export default router;