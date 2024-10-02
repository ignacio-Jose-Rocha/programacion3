import express from 'express';
import ClienteController from '../controllers/clienteController.js';

const router = express.Router();

// Login de cliente 
router.post("/clientes/login", ClienteController.login);

// Obtener tipos de reclamos
router.get("/tipos-reclamos", ClienteController.listarTiposReclamos);

// Obtener reclamos por usuario
router.get('/reclamos/usuario/:idUsuario', ClienteController.obtenerReclamoId);
// Obtener el estado de los reclamos
router.get('/reclamos/estado/:idCliente', ClienteController.obtenerReclamoEstado);

// Crear nuevo cliente y reclamo
router.post("/clientes", ClienteController.crearCliente);
router.post('/reclamos', ClienteController.crearReclamo);

// Cancelar reclamo por ID de cliente y reclamo
router.post("/clientes/:idCliente/reclamos/:idReclamo/cancelar", ClienteController.cancelarReclamo);

// Actualizar cliente
router.put("/clientes/:idUsuario", ClienteController.actualizarCliente);


export default router;