const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController.js')

// Descomente pra testar se o usuário routes ta funfando 
// console.log('🔥 FICHEIRO USUARIOROUTES CARREGADO COM SUCESSO!');
// dica: pra matar os processos e reiniciar o servidor, use npx kill-port 5000 

// Exemplo no teu arquivo de rotas de utilizador:
router.post('/signup', usuarioController.signup);
router.post('/login', usuarioController.login);

module.exports = router;



/*
Rotas pra testarr:


POST de Signup = http://localhost:5000/api/usuarios/signup

ex de requisição:
Cadastrando um CLIENTE:

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456password",
  "cpf": "111.222.333-44",
  "role": "CLIENTE",
  "endereco": "Rua das Flores, 123"
}

Pra alterar o "papel" do usuário, experimente trocar o role pra MOTORISTA ou GESTOR também.


POST de LOGIN: http://localhost:5000/api/usuarios/login


envie APENAS email e senha do usuário que quer testar aqui
{
  "email": "joao@email.com",
  "senha": "123456password"
}
*/