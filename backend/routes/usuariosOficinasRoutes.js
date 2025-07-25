import express from 'express';
import usuariosOficinasController from '../controllers/usuariosOficinasController.js';

const router = express.Router();

router.get('/obtener', usuariosOficinasController.getAllUsuariosOficinas);
router.get('/usuario/:idUsuario', usuariosOficinasController.getOficinasByUsuario);
router.get('/oficina/:idOficina', usuariosOficinasController.getUsuariosByOficina);
router.post('/asignar', usuariosOficinasController.asignarUsuarioAOficina);
router.put('/desasignar/:idUsuarioOficina', usuariosOficinasController.desasignarUsuarioDeOficina);

export default router;
