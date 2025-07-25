import express from 'express';
import usuariosOficinasController from '../controllers/usuariosOficinasController.js';

const router = express.Router();

router.get('/obtener', usuariosOficinasController.obtenerUsuariosOficina);
router.post('/asignar', usuariosOficinasController.asignarUsuarioOficina);
router.delete('/remover/:id', usuariosOficinasController.removerUsuarioOficina);

export default router;
