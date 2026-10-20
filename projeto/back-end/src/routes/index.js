/*Centralizar rotas da aplicação e fazer o nosso Router usar elas*/
const express = require('express');
const router = express.Router();

const coletaRoutes = require('./coletaRoutes');
const usuarioRoutes = require('./usuarioRoutes');

router.use('/usuarios', usuarioRoutes);
router.use('/coletas', coletaRoutes);

module.exports = router;