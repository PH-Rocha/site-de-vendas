const db = require('../config/db.config');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET;
const Usuario = db.Usuario;

exports.createUsuario = async (req, res) => {
  let usuario = {};

  try {
    usuario.login = req.body.login;
    usuario.senha = req.body.senha;
    usuario.email = req.body.email;

    Usuario.create(usuario,
      { attributes: ['id', 'login', 'senha', 'email', 'codigoExclusao'] })
      .then(result => {
        res.status(200).json(result);
      });
  } catch(error) {
    res.status(500).json({
      message: "Erro ao criar Usuário",
      error: error.message
    })
  }
}

exports.deleteUsuario = async (req, res) => {
  try{
    const usuarioId = req.params.id;
    const codigoExclusao = req.params.codigoExclusao;
  
    const usuario = await Usuario.findByPk(usuarioId);
  
    if(!usuario) {
      return res.status(404).json({
        message: "Usuário não encontrado com o ID fornecido",
        error: "404"
      });
    }
  
    const codigoEsperado = codigoExclusao;
  
    if(codigoEsperado != codigoExclusao){
      return res.status(401).json({
        message: "Código de exclusão incorreto. A exclusão requer o código correto.",
        error: "401"
      });
    }
  
    await usuario.destroy();
  
    return res.status(200).json({
      message: "Usuário deletado com sucesso"
    });

  }catch(error){
    return res.status(500).json({
      message: "Erro ao deletar o usuário",
      error: error.message
    });
  }
}

exports.updateUsuario = async (req, res) => {
  try{
    let usuario = await Usuario.findByPk(req.body.id);

    if(!usuario){
      return res.status(404).json({
        message: "Usuário não encontrado com o ID fornecido",
        error: "404"
      });
    } else {
      let updateObject = {
        login: req.body.login,
        email: req.body.email
      } 
      let result = await Usuario.update(updateObject, 
        {
        returning: true,
        where: { id: req.body.id },
        attributes: ['id', 'login','senha', 'email', 'codigoExclusao']
        }
      );

      if(!result){
        return res.status(500).json({
          message: "Erro ao atualizar o usuário:" + req.params.id,
          error: "500"
        });
      }

      return res.status(200).json({
        message: "Usuário atualizado com sucesso: " + result
      });
    }
  }catch(error){
    return res.status(500).json({
      message: "Erro ao atualizar o usuário",
      error: error.message
    })
  }
}

exports.Usuarios = (req, res) => {
  try{
    Usuario.findAll({ attributes: ['id', 'login', 'senha', 'email', 'codigoExclusao'] })
    .then(usuarios => {
      res.status(200).json(usuarios);
    });
  }catch(error){
    return res.status(500).json({
      message: "Erro ao buscar todos os usuários",
      error: error.message
    })
  }
}

exports.getUsuario = async (req, res) => {
  try{
    const usuario = await Usuario.findOne({
      where: { id: req.body.id },
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

    if(!usuario){
      return res.status(404).json({
        message: "Usuário não encontrado com o ID fornecido",
        error: "404"
      });
    }

    return res.status(200).json(usuario);
  }catch(error){
    return res.status(500).json({
      message: "Erro ao buscar usuário",
      error: error.message
    })
  }
}

exports.modifyPassword = async (req, res) => {
  try{
    const usuarioId = req.params.id;
    const { senha, novaSenha } = req.body;
    
    const usuario = await Usuario.findByPk(usuarioId);

    if(!usuario){
      return res.status(404).json({
        message: "Usuário não encontrado com o ID fornecido",
        error: "404"
      });
    }

    const senhaCorreta = await Usuario.verificarSenha(senha);

    if(!senhaCorreta){
      return res.status(401).json({
        message: "Senha atual incorreta",
        error: "401"
      });
    }

    await Usuario.update({ senha: novaSenha });

    return res.status(200).json({
      message: "Senha do usuário atualizada com sucesso"
    });
  }catch(error){
    return res.status(500).json({
      message: "Erro ao modificar a senha do usuário",
      error: error.message
    });
  }
}

exports.login = async (req, res) => {
  try{
    const { login, senha } = req.body;

    const usuario = await Usuario.findOne({
      where: { login }
    });

    if(!usuario){
      return res.status(404).json({
        message: "Usuário não encontrado com o ID fornecido",
        error: "404"
      });
    }

    const token = jwt.sign({ id: usuario.id, login: usuario.login}, secretKey, { expiresIn: '1h'});

    return res.status(200).json({ token, id: usuario.id });
  }catch(error){
    return res.status(500).json({
      message: "Erro ao realizar o login do usuário",
      error: error.message
    });
  }
}