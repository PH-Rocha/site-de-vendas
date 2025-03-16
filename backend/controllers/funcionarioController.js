const db = require('../config/db.config');
const Funcionario = db.Funcionario;

exports.createFuncionario = async (req, res) => {
  const { nome, idade, cargo, id_usuario } = req.body;
  try {
    if (!nome || !idade || !cargo || !id_usuario) {
      return res.status(400).json({
        message: "Os campos nome, idade, cargo, id_usuario são obrigatórios."
      });
    }

    const funcionario = await Funcionario.create({ nome, idade, cargo, id_usuario });

    return res.status(200).json(funcionario);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar funcionário",
      error: error.message
    })
  }
}

exports.deleteFuncionario = async (req, res) => {
  const { id: funcionarioId, codigoExclusao } = req.params;
  try {
    const funcionario = await Funcionario.findByPk(funcionarioId);

    if (!funcionario) {
      return res.status(404).json({
        message: "Funcionario não encontrado com o ID fornecido",
        error: "404"
      });
    }

    if (funcionario.codigoExclusao !== codigoExclusao) {
      return res.status(401).json({
        message: "Código de exclusão incorreto. A exclusão requer o código correto",
        error: "401"
      });
    }

    await funcionario.destroy();

    return res.status(200).json({
      message: "Funcionário deletado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletar funcionário",
      error: error.message
    })
  }
}

exports.updateFuncionario = async (req, res) => {
  const { id, nome, idade, cargo } = req.body;
  try {  
    const funcionario = await Funcionario.findByPk(id);

    if (!funcionario) {
      return res.status(404).json({
        message: "Funcionário não encontrado com o ID fornecido."
      });
    }

    let updateObject = {
      nome,
      idade, 
      cargo
    };

    const [updatedCount, updatedRows] = await Funcionario.update(updateObject, {
      where: { id },
      returning: true
    });

    if (updatedCount == 0) {
      return res.status(500).json({
        message: "Erro ao atualizar o funcionário"
      });
    }

    return res.status(200).json(updatedRows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar o funcionário",
      error: error.message
    })
  }
}

exports.Funcionarios =  async (req, res) => {
  try {
    const funcionario = await Funcionario.findAll();

    res.status(200).json(funcionario);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar os funcionários",
      error: error.message
    })
  }
}

exports.getFuncionario = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({
        message: "ID inválido. Insira um ID numérico válido."
      });
    }

    const funcionario = await Funcionario.findByPk(id);

    if (!funcionario) {
      return res.status(400).json({
        message: "Funcionário não encontrado com o ID fornecido."
      });
    }

    return res.status(200).json(funcionario);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar o funcionário",
      error: error.message
    })
  }
}