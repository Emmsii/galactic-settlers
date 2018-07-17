module.exports = function(sequelize, Sequelize) {
  var User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING(24),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    salt: {
      type: Sequelize.STRING(255),
      allowNull: false,
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscores: true
  });

  User.associate = (models) => {
    User.hasMany(models.System, {
      foreignKey: {
        name: 'user_id',
        allowNull: true
      }
    });
  };

  return User;
}
