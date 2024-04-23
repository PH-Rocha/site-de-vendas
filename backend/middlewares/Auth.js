const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.login = decoded.login;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Código inválido' });
  }
}

module.exports = verifyToken;