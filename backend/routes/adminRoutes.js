import express from 'express';
import AdminController from '../controllers/adminController.js';

const router = express.Router();

// Login del administrador
router.post("/administradores/login", AdminController.login);

// Obtener todos los administradores, clientes, empleados, reclamos, tipos de reclamos, oficinas, estadísticas, y PDF de reclamos
router.get('/administradores', AdminController.getAllAdministradores);
router.get('/clientes', AdminController.getAllClientes);
router.get('/empleados', AdminController.getAllEmpleados);
router.get('/reclamos', AdminController.getAllReclamos);
router.get('/reclamos/tipos', AdminController.getAllReclamosTipo);
router.get('/oficinas', AdminController.getAllOficinas);
router.get('/oficinas/:idOficina/empleados', AdminController.getEmpleadosByOficina);
router.get('/estadisticas', AdminController.getEstadisticasCompletas);
router.get('/reclamos/pdf', AdminController.descargarReclamosPDF);

// Crear nuevos usuarios, tipos de reclamo y asignar empleados a oficinas
router.post('/usuarios', AdminController.crearUsuario);
router.post("/reclamos/tipos", AdminController.crearReclamoTipo);
router.post("/oficinas/:idOficina/empleados", AdminController.asignarEmpleadoAOficina);

// Actualizar usuarios y tipos de reclamos
router.put("/usuarios/:idUsuarioModificado/:idUsuarioModificador", AdminController.actualizarUsuario);
router.put("/reclamos/tipos/:idReclamoTipo", AdminController.actualizarReclamoTipo);

// Eliminar usuarios, empleados de oficinas, y tipos de reclamos (cambiando su estado)
router.put("/usuarios/:idUsuario", AdminController.borrarUsuario);
router.put("/reclamos/tipos/:idReclamoTipo", AdminController.borrarReclamoTipo);
router.put("/oficinas/empleados/:idUsuario", AdminController.eliminarEmpleadoDeOficina);

export default router;
