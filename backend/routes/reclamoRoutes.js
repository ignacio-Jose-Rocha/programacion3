import express from 'express';
import ReclamoController from '../controllers/reclamoController.js';
import { validarCrearReclamo } from '../middleware/validaciones.js';

const router = express.Router();

router.get('/', ReclamoController.getAllReclamos);
router.post('/', validarCrearReclamo, ReclamoController.crearReclamo);
router.get('/obtener', ReclamoController.obtenerReclamoEstado);
router.patch('/cancelar/:idReclamo', ReclamoController.cancelarReclamo);

export default router;
