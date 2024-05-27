const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
  const Usuario = sequelize.define('usuario', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    login: {
      type: Sequelize.STRING,
      allowNull: false
    },
    senha: {
      type: Sequelize.STRING,
      allowNull: false,
      set(value) {
        if (value.length >= 8 && value.length <= 20) {
          this.setDataValue('senha', bcrypt.hashSync(value, 10));
        } else {
          throw new Error('Your password should be between 8-20 characters!' + value);
        }
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    codigoExclusao: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: () => uuidv4().replace(/-/g, '').substring(0, 5)
    },
  });

  Usuario.prototype.verificarSenha = async function (senha) {
    return await bcrypt.compare(senha, this.getDataValue('senha'));
  }

  Usuario.associate = (models) => {
    Usuario.hasOne(Cliente, {
      foreignKey: 'id_usuario'
    });
  };

  Usuario.associate = (models) => {
    Usuario.hasOne(Funcionario, {
      foreignKey: 'id_usuario'
    });
  };

  return Usuario;
};