import express from 'express';
import ReclamoOficinaController from '../controllers/reclamoOficinaController.js';

const router = express.Router();

// Obtener reclamos asociados a la oficina del empleado
router.get("/listar", ReclamoOficinaController.obtenerReclamosOficina);

// Atender un reclamo
router.put("/atender/:idReclamo", ReclamoOficinaController.atenderReclamo);

// Finalizar un reclamo
router.put("/finalizar/:idReclamo", ReclamoOficinaController.finalizarReclamo);

export default router;