/*Mapeia os endpoints das recolhas*/
/*OBS: caso for alterar fique atento com o controller também*/
const express = require('express');
const router = express.Router();
const coletaController = require('../controllers/coletaController');

router.post('/', coletaController.solicitarColeta);
router.get('/', coletaController.listarColetas);
router.put('/:id/coletar', coletaController.confirmarColeta);
router.put('/:id/pagar', coletaController.confirmarPagamento);

module.exports = router;