import express from 'express';
import reclamosTipoController from "../controllers/reclamosTipoController.js";

const router = express.Router();

// Rutas de ReclamoTipo
router.get("/obtener", reclamosTipoController.getAllReclamosTipo);
router.post("/crear", reclamosTipoController.crearReclamoTipo);
router.patch("/actualizar/:idReclamoTipo", reclamosTipoController.actualizarReclamoTipo);
router.put("/borrar/:idReclamoTipo", reclamosTipoController.borrarReclamoTipo);


export default router;