/*Centralizar rotas da aplicação e fazer o nosso Router usar elas*/
const express = require('express');
const router = express.Router();
const coletaRoutes = require('./coletaRoutes');

router.use('/coletas', coletaRoutes);

module.exports = router;