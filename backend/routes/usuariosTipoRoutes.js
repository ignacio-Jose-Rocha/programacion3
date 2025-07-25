import express from 'express';
import usuariosTipoController from '../controllers/usuariosTipoController.js';

const router = express.Router();

router.get('/obtener', usuariosTipoController.getAllUsuariosTipo);
router.post('/crear', usuariosTipoController.crearUsuarioTipo);
router.patch('/actualizar/:idUsuarioTipo', usuariosTipoController.actualizarUsuarioTipo);
router.put('/borrar/:idUsuarioTipo', usuariosTipoController.borrarUsuarioTipo);

export default router;
