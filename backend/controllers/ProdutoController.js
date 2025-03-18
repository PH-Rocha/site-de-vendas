const db = require('../config/db.config');
const Produto = db.Produto;

exports.createProduto = async (req, res) => {
  try {
    const { nome, preco, estoque } = req.body;
    
    if (!nome || !preco || !estoque) {
      return res.status(400).json({
        message: "Os campos nome, preço e estoque são obrigatórios"
      });
    }

    const produto = await Produto.create({ nome, preco, estoque});

    res.status(200).json(produto);   
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar produto.",
      error: error.message
    })
  }
}

exports.deleteProduto = async (req, res) => {
  try {
    const produtoId = req.params.id;

    const produto = await Produto.findByPk(produtoId);

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado com o ID fornecido",
        error: "404"
      });
    }

    await produto.destroy();

    return res.status(200).json({
      message: "Produto deletado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletar o produto",
      error: error.message
    })
  }
}

exports.updateProduto = async (req, res) => {
  try {
    let produto = await Produto.findByPk(req.body.id);

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado com o ID fornecido",
        error: "404"
      });
    } else {
      let updateObject = {
        nome: req.body.nome,
        preco: req.body.preco,
        estoque: req.body.estoque
      }
      let result = await Produto.update(updateObject,
        {
          returning: true,
          where: { id: req.body.id },
          attributes: ['id', 'nome', 'preco', 'estoque']
        }
      );

      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar produto",
      error: error.message
    });
  };
}

exports.Produtos = (req, res) => {
  try {
    Produto.findAll({ attributes: ['id', 'nome', 'preco', 'estoque'] })
      .then(produtos => {
        res.status(200).json(produtos);
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar todos os produtos.",
      error: error.message
    });
  }
}

exports.getProdutos = (req, res) => {
  try {
    Produto.findByPk(req.params.id,
      { attributes: ['id', 'nome', 'preco', 'estoque'] })
      .then(produto => {
        res.status(200).json(produto);
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar produto.",
      error: error.message
    });
  }
}

exports.addEstoque = async (req, res) => {
  try {
    let produtoId = req.params.id;
    let { estoque } = req.body;

    let produto = await Produto.findByPk(produtoId);

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado com o ID fornecido",
        error: "404"
      });
    };

    let novoEstoque = produto.estoque + estoque;
    await Produto.update({ estoque: novoEstoque }, { where: { id: produtoId } });

    return res.status(200).json({
      message: "Estoque atualizado com sucesso",
      novoEstoque: novoEstoque
    })
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao adicionar estoque",
      error: error.message
    })
  }
}

exports.removeEstoque = async (req, res) => {
  try {
    let produtoId = req.params.id;
    let {estoque} = req.body;

    if (estoque <= 0) {
      return res.status(400).json({
        message: "A quantidade a ser removida deve ser maior que zero",
        error: "400"
      });
    };

    let produto = await Produto.findByPk(produtoId);

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado com o ID forncecido",
        error: "404"
      });
    };

    let novoEstoque = produto.estoque - estoque;
    if (novoEstoque <= 0) {
      return res.status(400).json({
        message: "Não é possível remover mais estoque do que o disponível",
        error: "400"
      });
    };
    await Produto.update({ estoque: novoEstoque }, { where: { id: produtoId } });

    return res.status(200).json({
      message: "Estoque atualizado com sucesso",
      novoEstoque: novoEstoque
    })
  } catch (error){
    return res.status(500).json({
      message: "Erro ao adicionar estoque",
      error: error.message
    })
  }
}