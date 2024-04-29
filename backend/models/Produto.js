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
    preco: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    quantidade: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  Produto.associate = (models) => {
    Produto.belongsTo(Pedido, {
      foreignKey: 'produtoPedido'
    })
  }

  return Produto;
}