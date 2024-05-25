module.exports = (sequelize, Sequelize) => {
  const Pedido = sequelize.define('pedido', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    quantidade: {
      type: Sequelize.INTEGER,
      allowNull: false
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
      allowNull: false, 
      enum: ['pendente', 'completo', 'erro'],
      default: 'pendente'
    } 
  });

  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Cliente);
  }

  Pedido.associate = (models) => {
    Pedido.belongsToMany(models.Produto, {
      through: 'PedidoProduto',
      as: 'produto',
      foreignkey: 'produtoId'
    });
  };
  
  return Pedido;
}