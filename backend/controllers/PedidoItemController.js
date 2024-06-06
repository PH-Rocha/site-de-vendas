const db = require('../config/db.config');
const PedidoItem = db.PedidoItem;

exports.addProduto = async (req, res) => {
  let pedidoItem = {}
  try {
    pedidoItem.pedidoId = req.body.pedidoId;
    pedidoItem.produtoId = req.body.produtoId;
    pedidoItem.quantidade = req.body.quantidade;
    pedidoItem.precoUnidade = req.body.precoUnidade;

    pedidoItem.total = pedidoItem.quantidade * pedidoItem.precoUnidade;

    PedidoItem.create(pedidoItem,  
      { attributes: ['id', 'pedidoId', 'produtoId', 'quantidade', 'precoUnidade', 'total']})
      .then(result => {
        res.status(200).json(result);
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao adicionar pedido",
      error: error.message
    });
  }
}

