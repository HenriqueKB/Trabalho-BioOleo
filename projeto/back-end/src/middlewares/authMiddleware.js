const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET|| 'biooleo_secret_key';

// 1. Verifica se o token existe, é válido e não expirou
exports.autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Se não enviou o cabeçalho Authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  // O formato esperado é "Bearer <TOKEN>"
  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Erro no formato do token. Use: Bearer <token>' });
  }

  const token = partes[1];

  try {
    // Valida a assinatura do token com a chave secreta
    const decoded = jwt.verify(token, JWT_SECRET);

    // Guarda os dados decodificados (id, email, role) dentro do req
    req.usuario = decoded;

    // Permite que a requisição siga para o próximo passo (controller)
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Sua sessão expirou. Por favor, faça login novamente.' });
  }

  return res.status(401).json({ error: 'Token inválido.' });
}
};

// 2. Restringe o acesso apenas aos perfis (roles) informados
exports.autorizar = (...rolesPermitidas) => {
  return (req, res, next) => {
    // Garante que o usuário já passou pelo middleware de autenticação
    if (!req.usuario || !rolesPermitidas.includes(req.usuario.role)) {
      return res.status(403).json({ error: 'Acesso negado. Perfil sem permissão para esta ação.' });
    }

    return next();
  };
};



