import OficinaController from "../controllers/oficinaController.js";
import express from 'express';

const router = express.Router();

// Rutas de Oficina
router.get("/oficinas", OficinaController.getAllOficinas);
router.get("/oficinas/:idOficina/empleados", OficinaController.getEmpleadosByOficina);
router.post("/oficinas/:idOficina/empleados/:idUsuario", OficinaController.asignarEmpleadoAOficina);
router.put("/oficinas/empleados/:idUsuario", OficinaController.eliminarEmpleadoDeOficina);


export default router;