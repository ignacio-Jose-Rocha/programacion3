import express from 'express';
import reclamosEstadoController from '../controllers/reclamosEstadoController.js';

const router = express.Router();

router.get('/obtener', reclamosEstadoController.getAllReclamosEstado);
router.post('/crear', reclamosEstadoController.crearReclamoEstado);
router.put('/actualizar/:idReclamoEstado', reclamosEstadoController.actualizarReclamoEstado);
router.delete('/borrar/:idReclamoEstado', reclamosEstadoController.borrarReclamoEstado);

export default router;
