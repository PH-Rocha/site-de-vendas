module.exports = (sequelize, Sequelize) => {
  const Produto = sequelize.define('produto', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false
    },
    preço: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    quantidade: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

 
  return Produto;
}