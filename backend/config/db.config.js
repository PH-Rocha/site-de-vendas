require('dotenv').config();

const env = {
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,
  jwtsecret: process.env.JWT_SECRET
}

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorAliases: false
});

const db = [];

db.Usuario = require('../model/Usuario')(sequelize, Sequelize);
db.Cliente = require('../model/Cliente')(sequelize, Sequelize);
db.Funcionario = require('../model/Funcionario')(sequelize, Sequelize);
db.Produtos = require('../model/Produtos')(sequelize, Sequelize);

db.sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorAliases: false
});
db.jwtsecret = env.jwtsecret;

module.exports = db;

