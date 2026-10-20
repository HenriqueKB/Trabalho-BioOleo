/*Mapeia os endpoints das recolhas*/
/*OBS: caso for alterar fique atento com o controller também*/
const express = require('express');
const router = express.Router();
const coletaController = require('../controllers/coletaController.js');

router.post('/', coletaController.solicitarColeta);
router.get('/', coletaController.listarColetas);
router.put('/:id/coletar', coletaController.confirmarColeta);
router.put('/:id/pagar', coletaController.confirmarPagamento);

module.exports = router;


/*
Rotas pra Testar:
GET de coletas: http://localhost:5000/api/coletas
POST de coletas(solicitar coleta):  http://localhost:5000/api/coletas
PUT pra confirmar coleta: http://localhost:5000/api/coletas/:id/coletar
PUT pra confirmar pagamento: http://localhost:5000/api/coletas/:id/pagar
*/