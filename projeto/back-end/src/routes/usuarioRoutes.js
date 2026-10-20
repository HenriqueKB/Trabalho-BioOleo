const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js')


// Exemplo no teu arquivo de rotas de utilizador:
router.post('/signup', usuarioController.signup);
router.post('/login', usuarioController.login);

module.exports = router;