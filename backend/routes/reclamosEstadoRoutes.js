import express from 'express';
import reclamosEstadoController from '../controllers/reclamosEstadoController.js';

const router = express.Router();

router.get('/obtener', reclamosEstadoController.getAllEstados);
router.post('/crear', reclamosEstadoController.crearEstado);
router.put('/actualizar/:id', reclamosEstadoController.actualizarEstado);
router.delete('/eliminar/:id', reclamosEstadoController.eliminarEstado);

export default router;
