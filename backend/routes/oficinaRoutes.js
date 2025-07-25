import OficinaController from "../controllers/oficinaController.js";
import express from 'express';

const router = express.Router();

// Rutas de Oficina
router.get("/obtener", OficinaController.getAllOficinas);
router.post("/crear", OficinaController.crearOficina);
router.put("/actualizar/:id", OficinaController.actualizarOficina);
router.delete("/eliminar/:id", OficinaController.eliminarOficina);


export default router;