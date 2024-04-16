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