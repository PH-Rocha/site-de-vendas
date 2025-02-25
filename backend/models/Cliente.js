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
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cpfCnpj: {
      type: Sequelize.STRING,
      allowNull: false
    },
    telefone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    endereco: {
      type: Sequelize.STRING,
      allowNull: false
    },
    numero: {
      type: Sequelize.STRING,
      allowNull: false
    },
    complemento: {
      type: Sequelize.STRING,
      allowNull: false
    },
    bairro: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cep: {
      type: Sequelize.STRING,
      allowNull: false
    },
    id_usuario: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    referenciaExterna: {
      type: Sequelize.STRING,
      allowNull: true
    },
    asaasId: {
      type: Sequelize.STRING,
      allowNull: true
    }
  });

  Cliente.associate = (models) => {
    Cliente.belongsTo(models.Usuario);
  };

  Cliente.associate = (models) => {
    Cliente.hasMany(models.Pedido, {
      foreignKey: 'clienteId'
    });
  };

  return Cliente;
};
