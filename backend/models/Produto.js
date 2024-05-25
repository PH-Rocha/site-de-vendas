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
    estoque: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  Produto.associate = (models) => {
    Produto.belongsToMany(models.Pedido, {
      through: 'PedidoProduto',
      as: 'pedido',
      foreignKey: 'produtoId'
    });
  };

  return Produto;
}