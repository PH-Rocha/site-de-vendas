const asaasApi = require('./asaas');
const db = require('../config/db.config');
const vencimento = require('../funções/dataVencimento');
const requestIp = require('request-ip');
const Pedido = db.Pedido;
const PedidoItem = db.PedidoItem;
const Cliente = db.Cliente;
const Pagamento = db.Pagamento

exports.preAutorizacao = async (req, res) => {
  try {
    const { clienteId, pedidoId, pedidoItemId, holderName, number, expiryMonth, expiryYear, ccv } = req.body

    const clienteIp = requestIp.getClientIp(req);
    let dueData = vencimento();

    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente não encontrado",
        error: "404"
      });
    };

    const pedido = await Pedido.findByPk(pedidoId);

    if (!pedido) {
      return res.status(404).json({
        message: "Pedido não encontrado",
        error: "404"
      });
    };

    const item = await PedidoItem.findByPk(pedidoItemId);

    if (!item) {
      return res.status(404).json({
        message: "Item não encontrado",
        error: "404"
      });
    };

    const dadosAsaas = {
      billingType: 'CREDIT_CARD',
      creditCard: {
        holderName: holderName,
        number: number,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        ccv: ccv
      },
      creditCardHolderInfo: {
        name: cliente.nome,
        email: cliente.email,
        cpfCnpj: cliente.cpfCnpj,
        postalCode: cliente.cep,
        adressNumber: cliente.numero,
        adressComplement: cliente.complemento,
        phone: cliente.telefone
      },
      value: item.total,
      dueDate: dueData,
      description: `Pagamento de para ${cliente.nome}`,
      externalReference: `ID - ${cliente.id}`,
      remoteIp: clienteIp,
      customer: cliente.asaasId
    };

    const resAsaas = await asaasApi.post('v3/payments', dadosAsaas);

    if (resAsaas.status === 200 && resAsaas.data.status === 'CONFIRMED') {
      const pagamento = await Pagamento.create({
        asaasPagamentoId: resAsaas.data.id,
        status: resAsaas.data.status,
        description: dadosAsaas.description,
        value: dadosAsaas.value
      });

      res.status(200).json(pagamento);
    } else {
      return res.status(400).json({
        message: "Erro ao pre autorizar pagamento no Asaas",
        error: resAsaas.data.error
      });
    };
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao pre autorizar pagamento",
      error: error.message
    });
  }
}