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