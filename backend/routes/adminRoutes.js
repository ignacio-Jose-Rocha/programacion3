import express from 'express';
import AdminController from '../controllers/adminController.js';

const router = express.Router();

router.get('/administradores', AdminController.getAllAdministradores);
router.get("/adminLogin", AdminController.login);
router.put("/actualizarClienteAdmin/:idUsuarioModificado/:idUsuarioModificador", AdminController.actualizarClienteAdmin);
router.post("/borrarUsuario/:idUsuario", AdminController.borrarUsuario);

export default router;