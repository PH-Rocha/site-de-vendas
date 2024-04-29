const { where } = require('sequelize');
const db = require('../config/db.config');
const { canTreatArrayAsAnd } = require('sequelize/lib/utils');
const Produto  = db.Produto;

exports.createProduto = async (req, res) => {
  let produto = {};
  try{
    produto.nome = req.body.nome;
    produto.preco = req.body.preco;
    produto.quantidade = req.body.quantidade;

    Produto.create(produto, 
      { attributes: ['id', 'nome', 'preco', 'quantidade'] })
      .then(result => {
        res.status(200).json(result);
      })
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar produto.",
      error: error.message
    })
  }
} 

exports.deleteProduto = async (res, res) => {
  try{ 
    const produtoId = req.params.id;

    const produto = await Produto.findByPk(produtoId);

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado com o ID fornecido",
        error: "404"
      });
    };

    await Produto.destroy();

    return res.status(200).json({
      message: "Produto deletado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletar o produto",
      error: "500"
    })
  }
}

exports.updateProduto = async (req, res) => {
  try{
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
        quantidade: req.body.quantidade
      }
      let result = await Produto.update(updateObject,
        {
          returning: true,
          where: { id: req.body.id },
          attributes: ['id', 'nome', 'preco', 'quantidade']
        }
      );

      return res.status(200).json({
        message: "Produto atualizado com sucesso " + result
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar produto",
      error: error.message
    });
  };
}

exports.Produtos = (req, res) => {
  try{
    Produto.findAll( { attributes: ['id', 'nome', 'preco', 'quantidade'] })
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
  try{
    Produto.findByPk(req.params.id,
    { attributes: ['id', 'nome', 'preco', 'quantidade'] })
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