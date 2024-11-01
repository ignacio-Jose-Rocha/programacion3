import express from 'express';
import AdminController from '../controllers/adminController.js';


const router = express.Router();

// Rutas de Admin
router.get("/administradores", AdminController.getAllAdministradores);
router.get("/empleados", AdminController.getAllEmpleados);
router.get("/clientes", AdminController.getAllClientes);
router.post("/usuarios", AdminController.crearUsuario);
router.put("/usuarios/:idUsuarioModificado/:idUsuarioModificador", AdminController.actualizarUsuario);
router.put("/usuarios/:idUsuario", AdminController.borrarUsuario);

export default router;
