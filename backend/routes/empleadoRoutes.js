import express from 'express';
import EmpleadoController from '../controllers/empleadoController.js';


const router = express.Router();

// Login del empleado (POST para mayor seguridad)
router.post("/empleados/login", EmpleadoController.login);

// Obtener reclamos asociados a la oficina del empleado
router.get("/empleados/:idEmpleado/reclamos-oficina", EmpleadoController.listarReclamosOficina);

// Actualizar estado de un reclamo
router.put("/clientes/:idCliente/reclamos/:idReclamo/estado/:nuevoEstado", EmpleadoController.ActualizarEstadoReclamo);

export default router;