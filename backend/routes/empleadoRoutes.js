import express from 'express';
import EmpleadoController from '../controllers/empleadoController.js';

const router = express.Router();

router.get('/empleados', EmpleadoController.getAllEmpleados);
router.get("/empleadoLogin", EmpleadoController.login);
router.get("/listarReclamosOficina/:idEmpleado", EmpleadoController.listarReclamosOficina);
router.put("/actualizarEstadoReclamo/:idCliente/:nuevoEstado",EmpleadoController.ActualizarEstadoReclamo);

export default router;