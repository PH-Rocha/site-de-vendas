const db = require('../config/db.config');
const Pedido = db.Pedido;

exports.createPedido = async (req, res) => {
  try {
    const { clienteId, formaDePagamento } = req.body;

    if (!clienteId || !formaDePagamento) {
      return res.status(400).json({
        message: "OS campos clienteId e formaDePagamento são obrigatórios."
      })
    }

    const result = await Pedido.create({ clienteId, formaDePagamento});

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar pedido",
      error: error.message
    })
  }
}

exports.deletePedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id);

    if (!pedido) {
      return res.status(404).json({
        message: "Pedido não encontrado com o ID fornecido",
        error: "404"
      });
    }

    await pedido.destroy();

    return res.status(200).json({
      message: "Pedido deletado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletar pedido",
      error: error.message
    });
  }
}

exports.getPedido = async (req, res) => {
  const { id } = req.params;
  try {
   if (!id || isNaN(id)){
    return res.status(400).json({
      message: "ID inválido. Insira um ID numérico válido."
    });
   }

   const pedido = await Pedido.findByPk(id);

   if (!pedido) {
    return res.status(404).json({
      message: "Pedido não encontrado com o ID fornecido"
    });
   }

   return res.status(200).json(pedido);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar pedido",
      error: error.message
    });
  }
}
