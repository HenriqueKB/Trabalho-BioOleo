/*Lógica dos Controles sobre as Coletas e Regras de Negócio 
para as 3 telas do sistema também */
const prisma = require('../config/prisma');

// Cliente: Solicitar recolha de óleo
exports.solicitarColeta = async (req, res) => {
  try {
    const { clienteId, quantidadeGarrafas, enderecoColeta } = req.body;
    const codigoPET = `PET-${Math.floor(1000 + Math.random() * 9000)}`;

    const coleta = await prisma.coleta.create({
      data: {
        codigoPET,
        quantidadeGarrafas: Number(quantidadeGarrafas),
        enderecoColeta,
        clienteId
      }
    });

    res.status(201).json(coleta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar recolhas (Com filtro por status para Motorista e Gestor)
exports.listarColetas = async (req, res) => {
  try {
    const { status } = req.query;
    const coletas = await prisma.coleta.findMany({
      where: status ? { status } : {},
      include: {
        cliente: { select: { nome: true, cpf: true, pix: true } },
        motorista: { select: { nome: true } }
      },
      orderBy: { dataSolicitacao: 'desc' }
    });
    res.json(coletas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Motorista: Confirmar recolha no local (Validação da garrafa PET)
exports.confirmarColeta = async (req, res) => {
  try {
    const { id } = req.params;
    const { motoristaId } = req.body;

    const coleta = await prisma.coleta.update({
      where: { id },
      data: {
        status: 'COLETADO',
        motoristaId,
        dataColeta: new Date()
      }
    });

    res.json(coleta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Gestor: Confirmar pagamento PIX realizado manualmente
exports.confirmarPagamento = async (req, res) => {
  try {
    const { id } = req.params;

    const coleta = await prisma.coleta.update({
      where: { id },
      data: {
        status: 'PAGO',
        dataPagamento: new Date()
      }
    });

    res.json(coleta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};