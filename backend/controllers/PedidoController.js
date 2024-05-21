const db = require('../config/db.config');
const Pedido = db.Pedido;

exports.createPedido = async (req, res) => {
  let pedido = {};

  try{
    pedido.clientePedido = req.body.clientePedido;
    pedido.produtoPedido = req.body.produtoPedido;
    pedido.precoPedido = req.body.precoPedido;
    pedido.quantidadePedido = req.body.quantidadePedido;
    pedido.nomePedido = req.body.nomePedido;

    Pedido.create(pedido, 
      { attributes: ['id', 'clientePedido', 'produtoPedido', 'precoPedido', 'quantidadePedido', 'nomePedido' ] })
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
    }

    await Pedido.destroy();

    return res.status(200).json({
      message: "Pedido deletado com sucesso"
    })
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletado o pedido",
      error: error.message
    })
  }
}

exports.Pedido = (req, res) => {
  try {
    Pedido.findAll({ attributes: ['id', 'clientePedido','produtoPedido', 'precoPedido', 'quantidadePedido', 'nomePedido' ] })
    .then(pedidos => {
        res.status(200).json(pedidos);
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar os pedidos",
      error: error.message
    })
  }
}

exports.getPedido = (req, res) => {
  try {
    Pedido.findByPk(req.params.id, 
      { attributes: ['id', 'clientePedido', 'produtoPedido', 'precoPedido', 'quantidadePedido', 'nomePedido']})
      .then(pedido => {
        res.status(200).json(pedido);
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar o pedido",
      error: error.message
    })
  }
}