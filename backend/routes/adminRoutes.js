import express from 'express';
import AdminController from '../controllers/AdminController.js';

const router = express.Router();

router.get('/administradores', AdminController.getAllAdministradores);
router.get("/adminLogin", AdminController.login);
router.put("/actualizarUsuario/:idUsuarioModificado/:idUsuarioModificador", AdminController.actualizarUsuario);
router.put("/borrarUsuario/:idUsuario", AdminController.borrarUsuario);

export default router;