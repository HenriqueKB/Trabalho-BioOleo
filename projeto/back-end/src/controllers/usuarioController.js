const prisma = require('../config/prisma');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'biooleo_secret_key';

// Hash vai deixar a senha BEM feia, mas ao mesmo tempo, se tiver dois usuários com a mesma senha, ambos terão o mesmo hash, e hackers já possuem tabelas com hashs de senhas comuns, já sabe onde quero chegar com isso.
// Salt vai basicamente impedir essa repetição de hash, se dois usuários tiverem a mesma, com o salt eles NÃO terão o mesmo hash.
// PBKDF2 junta Salt e Hash e repete os dois VÁRIAS vezes pra cada senha, aqui estamos repetindo esse processo de salt e hash 310000 vezes, pra caso um hacker invadir a máquina dele coringar de vez.
// Com essa explicação em mente fica mais legal de ler essa joça toda, uau..

// Função auxiliar nativa para gerar Hash + Salt da palavra-passe
function encriptarSenha(senha) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(senha, salt, 310000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

// Função auxiliar para comparar a palavra-passe digitada no login com o hash guardado
function verificarSenha(senhaDigitada, senhaArmazenada) {
  const [salt, hashOriginal] = senhaArmazenada.split(':');
  const hashCalculado = crypto.pbkdf2Sync(senhaDigitada, salt, 310000, 32, 'sha256').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hashOriginal, 'hex'), Buffer.from(hashCalculado, 'hex'));
}

// CADASTRO (SIGNUP)
exports.signup = async (req, res) => {
  try {
    const { nome, email, senha, cpf, role, pix, endereco } = req.body;

    // 1. Validação de campos obrigatórios
    if (!nome || !email || !senha || !cpf) {
      return res.status(400).json({ error: 'Nome, email, CPF e senha são obrigatórios.' });
    }

    // 2. Validação do Perfil (Role) - Permite apenas os 3 perfis do sistema
    const perfisPermitidos = ['CLIENTE', 'MOTORISTA', 'GESTOR'];
    const perfilDefinido = role && perfisPermitidos.includes(role.toUpperCase()) 
      ? role.toUpperCase() 
      : 'CLIENTE';

    // 3. Verifica se o utilizador já existe (por Email ou CPF)
    const usuarioExistente = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { cpf }] }
    });

    if (usuarioExistente) {
      return res.status(409).json({ error: 'Email ou CPF já cadastrados.' });
    }

    // 4. Encripta a palavra-passe
    const senhaHash = encriptarSenha(senha);

    // 5. Cria o utilizador no Supabase via Prisma
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        cpf,
        senha: senhaHash,
        role: perfilDefinido,
        pix: pix || null,
        endereco: endereco || null
      }
    });

    // 6. Gera o Token JWT contendo a Role do utilizador
    const token = jwt.sign(
      { id: novoUsuario.id, email: novoUsuario.email, role: novoUsuario.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 7. Remove a senha da resposta por segurança
    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    return res.status(201).json({
      mensagem: 'Utilizador registado com sucesso!',
      token,
      usuario: usuarioSemSenha
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao cadastrar utilizador: ' + error.message });
  }
};

// AUTENTICAÇÃO (LOGIN)
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    // 1. Procura o utilizador no banco
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 2. Verifica se a palavra-passe coincide
    const senhaValida = verificarSenha(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // 3. Emite o JWT contendo a Role
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const { senha: _, ...usuarioSemSenha } = usuario;

    return res.status(200).json({
      mensagem: 'Login efetuado com sucesso!',
      token,
      usuario: usuarioSemSenha
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao autenticar: ' + error.message });
  }
};