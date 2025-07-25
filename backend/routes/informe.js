import express from 'express';
import informeController from '../controllers/informeController.js';


const router = express.Router();

router.get("/informe", informeController.generarInforme);


export default router;
