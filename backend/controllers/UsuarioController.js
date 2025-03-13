const db = require('../config/db.config');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../config/config');

const Usuario = db.Usuario;

exports.createUsuario = async (req, res) => {
  try {
    const { login, senha, email } = req.body;

    if (!login || !senha || !email) {
      return res.status(400).json({
        message: "Os campos login, senha, email são obrigatórios."
      });
    };

    const usuario = await Usuario.create({ login, senha, email });

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar Usuário",
      error: error.message
    })
  }
}

exports.deleteUsuario = async (req, res) => {
  const { id: usuarioId, codigoExclusao } = req.params;
  try {
    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado com o ID fornecido",
        error: "404"
      });
    }

    if (usuario.codigoExclusao !== codigoExclusao) {
      return res.status(401).json({
        message: "Código de exclusão incorreto. A exclusão requer o código correto.",
        error: "401"
      });
    }

    await usuario.destroy();

    return res.status(200).json({
      message: "Usuário deletado com sucesso"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletar o usuário",
      error: error.message
    });
  }
}

exports.updateUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.body.id);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado com o ID fornecido",
        error: "404"
      });
    }

    let updateObject = {
      login: req.body.login,
      email: req.body.email
    }

    const [updatedCount, updatedRows] = await Usuario.update(updateObject, {
      where: { id }, 
      returning: true
    });
    
    if(updatedCount == 0) {
      return res.status(500).json({
        message: "Erro ao atualizar o usuário",
        error: "400"
      });
    }

    return res.status(200).json(updatedRows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar o usuário",
      error: error.message
    })
  }
}

exports.Usuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ["id", "login", "email", "codigoExclusao"]
    });

    res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar todos os usuários",
      error: error.message
    })
  }
}

exports.getUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({
        message: "ID inválido. Insira um ID numérico válido."
      });
    };

    const usuario = await Usuario.findOne({
      where: { id },
      attributes: ['id', 'login', 'email', 'codigoExclusao'],
      include: [
        {
          model: db.Cliente,
          attributes: ['id', 'nome', 'idade', 'id_usuario']
        },
        {
          model: db.Funcionario,
          attributes: ['id', 'nome', 'idade', 'id_usuario']
        }
      ]
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado com o ID fornecido",
        error: "404"
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar usuário",
      error: error.message
    })
  }
}

exports.modifyPassword = async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const { senha, novaSenha } = req.body;

    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado com o ID fornecido",
        error: "404"
      });
    }

    const senhaCorreta = await Usuario.verificarSenha(senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        message: "Senha atual incorreta",
        error: "401"
      });
    }

    usuario.senha = novaSenha;

    await Usuario.save();

    return res.status(200).json({
      message: "Senha do usuário atualizada com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao modificar a senha do usuário",
      error: error.message
    });
  }
}

exports.login = async (req, res) => {
  const { login, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({
      where: { login }
    });

    if (!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado com o ID fornecido",
        error: "404"
      });
    }

    const senhaCorreta = await usuario.verificarSenha(senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        message: "Senha atual incorreta",
        error: "401"
      })
    }

    const token = jwt.sign({ id: usuario.id, login: usuario.login }, secretKey, { expiresIn: '1h' });

    return res.status(200).json({ token, id: usuario.id });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao realizar o login do usuário",
      error: error.message
    });
  }
}