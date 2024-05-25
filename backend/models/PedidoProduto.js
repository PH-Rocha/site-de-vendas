module.exports = (sequelize, Sequelize) => {
  const PedidoProduto = sequelize.define('PedidoProduto', {
    quantidade: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  return PedidoProduto;
}