const db = require('../config/db.config');
const PedidoItem = db.PedidoItem;
const Pedido = db.Pedido;
const Produto = db.Produto;

exports.addProduto = async (req, res) => {
  let pedidoItem = {};
  try {
    pedidoItem.pedidoId = req.body.pedidoId;
    pedidoItem.produtoId = req.body.produtoId;
    pedidoItem.quantidade = req.body.quantidade;

    const pedido = await Pedido.findByPk(pedidoItem.pedidoId);
    if (!pedido) {
      return res.status(404).json({
        message: "Pedido não encontrado com o ID fornecido",
        error: "404"
      });
    };

    const produto = await Produto.findByPk(pedidoItem.produtoId);
    if (!produto || produto.estoque < pedidoItem.quantidade) {
      return res.status(400).json({
        message: "Produto não encontrado ou estoque insuficiente",
        error: "400"
      });
    };

    const total = pedidoItem.quantidade * produto.preco;

    PedidoItem.create(pedidoItem,
      { attributes: ['id', 'pedidoId', 'produtoId', 'quantidade', 'precoUnidade', 'total'] })
      .then(result => {
        res.status(200).json(result);
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao adicionar um produto ao pedido",
      error: error.message
    })
  }
}

exports.removeProduto = async (req, res) => {
  try {
    const produtoId = req.params.id;

    const produtoItem = await PedidoItem.findByPk(produtoId);

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado com o ID fornecido",
        error: "404"
      });
    };

    await produtoItem.destroy();

    return res.status(200).json({
      message: "Produto removido do pedido com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao remover produto do pedido",
      error: error.message
    })
  }
}

exports.listPedido = (req, res) => {
  try {
    PedidoItem.findAll({ attributes: ['id', 'pedidoId', 'produtoId', 'quantidade', 'precoUnidade', 'total'] })
    .then(pedidoItem => {
      res.status(200).json(pedidoItem);
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar os produtos do pedido",
      error: error.message
    })
  }
}
