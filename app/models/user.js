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
      allowNull: false
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
    current_galaxy: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null
    },
    home_system: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true
  });

  User.associate = (models) => {
    User.hasMany(models.System, {
      foreignKey: {
        name: 'user_id',
        allowNull: true,
        onDelete: 'SET NULL'
      }
    });
  };

  return User;
}
