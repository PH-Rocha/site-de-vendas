module.exports = (sequelize, Sequelize) => {
  const pagamento = sequelize.define('pagamento', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    asaasPagamentoId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false
    }
  });

  return pagamento;
}