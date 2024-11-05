import express from 'express';
import AdminController from '../controllers/adminController.js';
import upload from '../config/multerConfig.js'; 

const router = express.Router();

// Rutas de Admin
router.get("/administradores", AdminController.getAllAdministradores);
router.get("/empleados", AdminController.getAllEmpleados);
router.get("/clientes", AdminController.getAllClientes);
router.post(
    "/usuarios",
    upload.single('imagen'), 
    AdminController.crearUsuario
);
router.put(
    "/usuarios/:idUsuarioModificado", 
    upload.single('imagen'), 
    AdminController.actualizarUsuario
);
router.put("/usuarios/:idUsuario", AdminController.borrarUsuario);

export default router;
