const db = require('../config/db.config');
const Cliente = require('../models/Cliente');
const Pedido = db.Pedido;

exports.AddProduto = async (req, res) => {
  try {
    const { clienteId, produtoId, quantidade } = req.body;

    const cliente = await Cliente.findByPk(clienteId);
    
    if (!cliente) {
      return res.status(404).json({
        message: "Cliente não encontrado com o ID fornecido",
        error: "404"
      });
    };

    const produto = await Produto.findByPk(produtoId);

    if (!produto || produto.stock < quantidade) {
      return res.status(400).json({
        message: "Produto não encontrado ou estoque insuficiente",
        error: "400"
      });
    };

    const pedidoItem = await Pedido.create({ clienteId, produtoId, quantidade });

    produto.stock -= quantidade;

    await produto.save();

    res.status(200).json(pedidoItem);
  } catch (error) {
    return res.status(500).json( {
      message: "Erro ao adicionar item ao pedido",
      error: error.message
    })
  }
}

exports.deleteItemPedido = async (req, res) => {
  
}