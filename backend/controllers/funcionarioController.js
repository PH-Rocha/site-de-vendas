const db = require('../config/db.config');
const Funcionario = db.Funcionario;

exports.createFuncionario = async (req, res) => {
  let funcionario = {};

  try{
    funcionario.nome = req.body.nome;
    funcionario.idade = req.body.idade;
    funcionario.id_usuario = req.body.id_usuario;

    Funcionario.create(funcionario, 
    { attributes: ['id', 'nome', 'idade', 'id_usuario']})
    .then(result => {
      res.status(200).json(result);
    });
  }catch(error){
    return res.status(500).json({
      message: "Erro ao criar funcionário",
      error: error.message
    })
  }
}

exports.deleteFuncionario = async (req, res) => {
  try{
    const funcionarioId = req.params.id;
    const codigoExclusao = req.params.codigoExclusao;

    const funcionario = await Funcionario.findByPk(funcionarioId);

    if (!funcionario) {
      return res.status(404).json({
        message: "Funcionario não encontrado com o ID fornecido",
        error: "404"
      });
    }

    const codigoEsperado = codigoExclusao;

    if (codigoEsperado != codigoExclusao) {
      return res.status(401).json({
        message: "Código de exclusão incorreto. A exclusão requer o código correto",
        error: "401"
      });
    }

    await funcionario.destroy();

    return res.status(200).json({
      message: "Funcionário deletado com sucesso"
    });
  }catch(error){
    return res.status(500).json({
      message: "Erro ao deletar funcionário",
      error: error.message
    })
  }
}

exports.updateFuncionario = async (req, res) => {
  try{
    let funcionario = await Funcionario.findByPk(req.body.id);

    if (!funcionario) {
      return res.status(404).json({
        message: "Funcionário não encontrado com o ID fornecido",
        error: "404"
      });
    }
  }
}