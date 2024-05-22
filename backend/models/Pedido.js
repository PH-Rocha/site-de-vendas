module.exports = (sequelize, Sequelize) => {
  const Pedido = sequelize.define('pedido', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    clienteId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    produtoId: {
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