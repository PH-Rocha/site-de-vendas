const asaasApi = require('./asaas');
const db = require('../config/db.config');
const Pedido = db.Pedido;
const PedidoItem = db.PedidoItem;
const Cliente = db.Cliente;

exports.preAutorizacao = async (req, res) => {
  try{
    const clienteId = req.body.id;
    const pedidoId = req.body.id;
    const pedidoItemId = req.body.id;

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
      custumer: cliente.asaasId,
      billingType: pedido.formaDePagamento,
      value: pedidoItemId.total,
      //dueDate: add uma função para criar uma data de vencimento
    }
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao pre autorizar pagamento",
      error: error.message
    })
  }
}