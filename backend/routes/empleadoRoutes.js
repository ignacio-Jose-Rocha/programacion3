import express from 'express';
import EmpleadoController from '../controllers/empleadoController.js';


const router = express.Router();

// Login del empleado
router.post("/login", EmpleadoController.login);

// Obtener reclamos asociados a la oficina del empleado
router.get("/:idEmpleado/reclamos-oficina", EmpleadoController.listarReclamosOficina);

// Actualizar estado de un reclamo
router.put("/cliente/:idCliente/reclamo/:idReclamo/estado/:nuevoEstado", EmpleadoController.ActualizarEstadoReclamo);

export default router;