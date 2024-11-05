import express from 'express';
import reclamosTipoController from "../controllers/reclamosTipoController.js";

const router = express.Router();

// Rutas de ReclamoTipo
router.get("/tipos-reclamos", reclamosTipoController.getAllReclamosTipo);
router.post("/tipos-reclamos", reclamosTipoController.crearReclamoTipo);
router.put("/tipos-reclamos/:idReclamoTipo", reclamosTipoController.actualizarReclamoTipo);
router.put("/tipos-reclamos/:idReclamoTipo", reclamosTipoController.borrarReclamoTipo);


export default router;