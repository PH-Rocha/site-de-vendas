module.exports = (sequelize, Sequelize) => {
  const pagamento = sequelize.define('pagamento', {
    idPagamento: {
      type: Sequelize.STRING,
      allowNull: false
    },
  });

  return pagamento;
}