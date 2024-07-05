const db = require('../config/db.config');
const Pedido = db.Pedido;

exports.createPedido = (req, res) => {
  let pedido = {}
  try {
    pedido.clienteId = req.body.clienteId;
    pedido.formaDePagamento = req.body.formaDePagamento;

    Pedido.create(pedido, 
      { attributes: ['id', 'clienteId', 'formaDePagamento'] })
      .then(result => {
        res.status(200).json(result);
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar pedido",
      error: error.message
    })
  }
}

exports.deletePedido = async (req, res) => {
  try {
    const pedidoId = req.params.id;

    const pedido = await Pedido.findByPk(pedidoId);

    if (!pedido) {
      return res.status(404).json({
        message: "Pedido não encontrado com o ID fornecido",
        error: "404"
      });
    };

    await pedido.destroy();

    res.status(200).json({
      message: "Pedido deletado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletar pedido",
      error: error.message
    });
  }
}

exports.getPedido = (req, res) => {
  try {
    Pedido.findByPk(req.params.id, 
    { attributes: ['id', 'clienteId', 'formaDePagamento']})
    .then(pedido => {
      res.status(200).json(pedido);
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar pedido",
      error: error.message
    });
  }
}
 