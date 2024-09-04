const express = require('express');
const usuariosController = require('../controllers/usuarioController.js');
const router = express.Router();
router.get('/clientes', usuariosController.getAllclientes);
router.get("/clienteLogin", usuariosController.login);
router.put("/actualizarCliente/:idUsuario", usuariosController.actualizarCliente);
module.exports = router;
