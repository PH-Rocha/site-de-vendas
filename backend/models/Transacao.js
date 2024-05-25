module.exports = (sequelize, Sequelize) => {
  const Transacao = sequelize.define('transacao', {
    total: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      enum: ['pendente', 'completo', 'erro'],
      default: 'pendente'
    },
    clienteId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  Transacao.associate = (models) => {
    Transacao.belongsTo(models.Cliente);
  };

  return Transacao;
}