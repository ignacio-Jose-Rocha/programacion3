import express from 'express';
import AdminController from '../controllers/adminController.js';

const router = express.Router();

router.get('/empleados', AdminController.getAllEmpleados);
router.get('/clientes', AdminController.getAllClientes);
router.post('/empleado', AdminController.crearEmpleado);
router.put('/empleado/:id', AdminController.actualizarEmpleado);
router.delete('/empleado/:id', AdminController.eliminarEmpleado);

export default router;
