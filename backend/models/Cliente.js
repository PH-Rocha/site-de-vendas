module.exports = (sequelize, Sequelize) => {
  const Cliente = sequelize.define('cliente', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false
    },
    idade: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_usuario: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  Cliente.associate = (models) => {
    Cliente.belongsTo(models.Usuario);
  };

  Cliente.associate = (models) => {
    Cliente.hasMany(Pedido, {
      foreignKey: 'clienteId'
    });
  };

  Cliente.associete = (models) => {
    Cliente.hasOne(Transacao, {
      foreignKey: 'clienteId'
    });
  };
  return Cliente;
};
