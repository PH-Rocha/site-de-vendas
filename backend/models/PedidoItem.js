module.exports = (sequelize, Sequelize) => {
  const PedidoItem = sequelize.define('pedidoItem', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pedidoId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    produtoId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    quantidade: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    precoUnidade: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    total: {
      type: Sequelize.FLOAT,
      allowNull: false
    } 
  });

  PedidoItem.associate = (models) => {
    PedidoItem.belongTo(models.Produto);
  };

  PedidoItem.associate = (models) => {
    PedidoItem.belongTo(models.Pedido);
  };
  
  return PedidoItem;
}