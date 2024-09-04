const express = require('express');
const usuariosController = require('../controllers/usuarioController.js');
const router = express.Router();
router.get('/clientes', usuariosController.getAllUsuarios);
module.exports = router;
