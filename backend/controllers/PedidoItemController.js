const { TableHints } = require('sequelize');
const db = require('../config/db.config');
const PedidoItem = db.PedidoItem;
const Pedido = db.Pedido;
const Produto = db.Produto;

exports.addProduto = async (req, res) => {
  const { pedidoId, produtoId, quantidade } = req.body;
  try {
    if (!pedidoId || !produtoId || !quantidade) {
      return res.status(400).json({
        message: "Os campos pedidoId, produtoId e quantidade são obrigatórios."
      });
    }

    const transaction = await db.sequelize.transaction();

    const pedido = await Pedido.findByPk(pedidoId, { transaction });
    if (!pedido) {
      await transaction.rollback();
      return res.status(404).json({
        message: "Pedido não encontrado com o ID fornecido"
      });
    }

    const produto = await Produto.findByPk(produtoId, { transaction });
    if (!produto || produto.estoque < quantidade) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Produto não encontrado ou estoque insuficiente"
      });
    }

    const precoUnidade = produto.preco;

    const total = quantidade * precoUnidade;

    const pedidoItemData = await PedidoItem.create({
      pedidoId,
      produtoId,
      quantidade,
      precoUnidade,
      total
    }, { transaction });


    produto.estoque -= quantidade;
    await produto.save({ transaction });

    await transaction.commit();

    return res.status(200).json(pedidoItemData);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao adicionar um produto ao pedido"
    })
  }
}

exports.removeProduto = async (req, res) => {
  const pedidoItemId = req.params.id;
  const removerQuantidade = req.body.quantidade;

  try {
    console.log(pedidoItemId);
    console.log(removerQuantidade);

    const pedidoItem = await PedidoItem.findByPk(pedidoItemId);

    if (!pedidoItem) {
      return res.status(404).json({
        message: "PedidoItem não encontrado",
        error: "404"
      });
    }

    if (removerQuantidade > pedidoItem.quantidade) {
      return res.status(400).json({
        message: "A quantidade a ser removida é maior qua a quantidade atual do pedidoItem",
        error: "400"
      });
    }

    pedidoItem.quantidade -= removerQuantidade;

    console.log(pedidoItem.quantidade);
    pedidoItem.total = parseFloat((pedidoItem.quantidade * pedidoItem.precoUnidade).toFixed(2));

    console.log(pedidoItem.total);
    await pedidoItem.save();

    return res.status(200).json(pedidoItem);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao remover produto do pedido",
      error: error.message
    })
  }
}

exports.listPedido = async (req, res) => {
  try {
    const pedidoItens = await PedidoItem.findAll({ attributes: ['id', 'pedidoId', 'produtoId', 'quantidade', 'precoUnidade', 'total'] });

    let totalPedido = 0;
    pedidoItens.forEach(pedidoItem => {
      totalPedido += parseFloat(pedidoItem.total);
    });

    const resultado = {
      pedidoItens: pedidoItens,
      totalPedido: totalPedido.toFixed(2)
    }

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar os produtos do pedido",
      error: error.message
    })
  }
}

exports.deletePedidoItem = async (req, res) => {
  const pedidoItemId = req.params.id;

  try {
    const pedidoItem = await PedidoItem.findByPk(pedidoItemId);
    if (!pedidoItem) {
      return res.status(404).json({
        message: "PedidoItem não encontrado com o ID fornecido",
        error: "404"
      });
    }

    await PedidoItem.destroy({ where: { id: pedidoItemId } });

    return res.status(200).json({
      message: "PedidoItem deletado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletar pedidoItem",
      error: error.message
    });
  }
}