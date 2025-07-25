import express from 'express';
import ReclamoTipoController from '../controllers/reclamoTipoController.js';

const router = express.Router();

router.get('/obtener', ReclamoTipoController.getAllReclamosTipo);
router.post('/crear', ReclamoTipoController.crearReclamoTipo);
router.put('/actualizar/:id', ReclamoTipoController.actualizarReclamoTipo);
router.delete('/borrar/:id', ReclamoTipoController.borrarReclamoTipo);

export default router;
