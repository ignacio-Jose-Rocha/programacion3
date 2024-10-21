import express from 'express';
import ReclamoOficinaController from '../controllers/reclamoOficinaController.js';
import authenticate from '../middleware/authenticate.js'; 
import esEmpleado from '../middleware/esEmpleado.js'; 


const router = express.Router();


// Obtener reclamos asociados a la oficina del empleado
router.get(
    "/:idEmpleado/reclamos-oficina",
    [authenticate, esEmpleado],
    ReclamoOficinaController.listarReclamosOficina
  );

// Actualizar estado de un reclamo
router.put(
    "/cliente/:idCliente/reclamo/:idReclamo/estado/:nuevoEstado",
    [authenticate, esEmpleado],
    ReclamoOficinaController.ActualizarEstadoReclamo
  );

export default router;