import OficinaController from "../controllers/oficinaController.js";
import express from 'express';

const router = express.Router();

// Rutas de Oficina
router.get("/obtener", OficinaController.getAllOficinas);
router.get("/:idOficina/empleados", OficinaController.getEmpleadosByOficina);
router.post("/:idOficina/empleado/:idUsuario", OficinaController.asignarEmpleadoAOficina);
router.put("/empleado/:idUsuario", OficinaController.eliminarEmpleadoDeOficina);


export default router;