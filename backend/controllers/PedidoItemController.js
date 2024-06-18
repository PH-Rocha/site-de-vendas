const db = require('../config/db.config');
const PedidoItem = db.PedidoItem;
const Pedido = db.Pedido;
const Produto = db.Produto;

exports.addProduto = async (req, res) => {
  try {
    const { pedidoId, produtoId, quantidade, precoUnidade } = req.body;

    const pedido = await Pedido.findByPk(pedidoId);

    if (!pedido) {
      return res.status(404).json({
        message: "Pedido não encontrado com o Id fornecido",
        error: "404"
      });
    };

    const produto = await Produto.findByPk(produtoId);

    if (!produto || produto.estoque < quantidade) {
      return res.status(400).json({
        message: "Produto não encontrado ou estoque insuficiente",
        error: "404"
      });
    };

    const total = quantidade * precoUnidade;

    const pedidoItem = await PedidoItem.create({
      pedidoId,
      produtoId,
      quantidade,
      precoUnidade,
      total
    });

    const novoEstoque = produto.estoque - quantidade;
    await Produto.update({ estoque: novoEstoque }, { where: { id: produtoId } });

    return res.status(200).json({
      message: "Produto adicionado ao pedido com sucesso",
      pedidoItem: pedidoItem
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
