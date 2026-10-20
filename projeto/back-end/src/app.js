/*Configuração de Middlewares e prefixos de rotas*/
const express = require('express');
const cors = require('cors');
const routes = require('./routes', './routes/coletaRoutes.js');

const app = express();

app.use(cors());
app.use(express.json());

// Rota base da API
app.use('/api', routes);

module.exports = app;