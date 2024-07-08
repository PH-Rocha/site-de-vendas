  const db = require('../config/db.config');
  const PedidoItem = db.PedidoItem;
  const Pedido = db.Pedido;
  const Produto = db.Produto;

  console.log(db);
  console.log(PedidoItem);

exports.addProduto = async (req, res) => {
  let pedidoitem = {};
  try {
    pedidoitem.pedidoId = req.body.pedidoId;
    pedidoitem.produtoId = req.body.produtoId;
    pedidoitem.quantidade = req.body.quantidade;

    const pedido = await Pedido.findByPk(pedidoitem.pedidoId);
    if (!pedido) {
      return res.status(404).json({
        message: "Pedido não encontrado com o ID fornecido",
        error: "404"
      });
    };

    console.log(pedido);
    const produto = await Produto.findByPk(pedidoitem.produtoId);
    if (!produto || produto.estoque < pedidoitem.quantidade) {
      return res.status(400).json({
        message: "Produto não encontrado ou estoque insuficiente",
        error: "400"
      });
    };

    console.log(produto);
    pedidoitem.precoUnidade = produto.preco;

    console.log(pedidoitem.precoUnidade);

    pedidoitem.total = pedidoitem.quantidade * pedidoitem.precoUnidade;

    console.log(pedidoitem.total);

    console.log(pedidoitem);
    const result = await PedidoItem.create(pedidoitem, 
      { attributes: ['id', 'pedidoId', 'produtoId', 'quantidade', 'precoUnidade', 'total']});


    produto.estoque -= pedidoitem.quantidade;
    await produto.save();

    console.log(produto.estoque);

    return res.status(200).json(result);
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

    if (!produtoItem) {
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
