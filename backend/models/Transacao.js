module.exports = (sequelize, Sequelize) => {
  const Transacao = sequelize.define('transacao', {
    total: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    clienteId: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  Transacao.associete = (models) => {
    Transacao.belongsTo(models.cliente);
  };
}