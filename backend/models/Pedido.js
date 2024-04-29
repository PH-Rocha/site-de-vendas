module.exports = (sequelize, Sequelize) => {
  const Pedido = sequelize.define('pedido', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    clientePedido: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    produtoPedido: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    preçoPedido: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    quantidadePedido: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    nomePedido: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    } 
  });

  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Cliente);
  }

  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Produto);
  }
  
  return Pedido;
}