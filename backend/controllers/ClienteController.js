const db = require('../config/db.config');
const Cliente = db.Cliente;

exports.createCliente = async (req, res) => {
  let cliente = {};

  try {
    cliente.nome = req.body.nome;
    cliente.idade = req.body.idade;
    cliente.id_usuario = req.body.id_usuario

    Cliente.create(cliente,
      { attributes: ['id', 'nome', 'idade', 'id_usuario'] })
      .then(result => {
        res.status(200).json(result);
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar cliente",
      error: error.message
    })
  }
}

exports.deleteCliente = async (req, res) => {
  try {
    const clienteId = req.params.id;
    const codigoExclusao = req.params.codigoExclusao;

    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente não encontrado com o ID fornecido",
        error: "404"
      });
    }

    const codigoEsperado = cliente.codigoExclusao;

    if (codigoEsperado != codigoExclusao) {
      return res.status(401).json({
        message: "Código de exclusão incorreto. A exclusão requer o código correto",
        error: "401"
      });
    }

    await cliente.destroy();

    return res.status(200).json({
      message: "Cliente deletado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletar o cliente",
      error: error.message
    })
  }
}

exports.updateCliente = async (req, res) => {
  try {
    let cliente = await Cliente.findByPk(req.body.id);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente não encontrado com o ID fornecido",
        error: "404"
      });
    } else {
      let updateObject = {
        nome: req.body.nome,
        idade: req.body.idade
      }
      let result = await Cliente.update(updateObject,
        {
          returning: true,
          where: { id: req.body.id },
          attributes: ['id', 'nome', 'idade', 'id_usuario']
        }
      );

      if (!result) {
        return res.status(500).json({
          message: "Erro ao atualizar cliente:" + req.params.id,
          error: "500"
        });
      }

      return res.status(200).json({
        message: "Cliente atualizado com sucesso:" + result
      });
    }
  }catch(error){
    return res.status(500).json({
      message: "Erro ao atualizar o cliente",
      error: error.message
    })
  }
} 

exports.Clientes = (req, res) => {
  try{
    Cliente.findAll({ attributes: ['id', 'nome', 'idade', 'id_usuario'] })
    .then(clientes => {
      res.status(200).json(clientes);
    });
  }catch(error){
    return res.status(500).json({
      message: "Erro ao buscar os clientes",
      error: error.message
    });
  }
}

exports.getClientes = (req, res) => {
  try{
    Cliente.findByPk(req.params.id, 
    { attributes: ['id', 'nome', 'idade', 'id_usuario']})
    .then(cliente => {
      res.status(200).json(cliente);
    });
  }catch(error){
    return res.status(500).json({
      message: "Erro ao buscar o cliente",
      error: error.message
    })
  }
}