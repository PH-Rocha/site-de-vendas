require('dotenv').config();

const env = {
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,
  jwtSecret: process.env.JWT_SECRET
}

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorAliases: false
});

const db = [];

db.Usuario = require('../models/Usuario')(sequelize, Sequelize);
db.Cliente = require('../models/Cliente')(sequelize, Sequelize);
db.Funcionario = require('../models/Funcionario')(sequelize, Sequelize);
db.Produto = require('../models/Produto')(sequelize, Sequelize);
db.Pedido = require('../models/Pedido')(sequelize, Sequelize);
db.PedidoItem = require('../models/pedidoItem', sequelize, Sequelize);
db.Transacao = require('../models/Transacao')(sequelize, Sequelize);

db.sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorAliases: false
});
db.jwtSecret = env.jwtSecret;

module.exports = db;

