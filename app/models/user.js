module.exports = function(sequelize, Sequelize){
  var User = sequelize.define('users', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
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
    salt: {
      type: Sequelize.STRING(255),
      allowNull: false,
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci'
  });

  return User;
}
