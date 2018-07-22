module.exports = function(sequelize, Sequelize) {
  var System = sequelize.define('System', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    galaxy_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    x: {
      type: Sequelize.SMALLINT,
      allowNull: false
    },
    y: {
      type: Sequelize.SMALLINT,
      allowNull: false
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true
  });

  System.associate = (models) => {
    System.hasMany(models.Planet, {
      foreignKey: {
        name: 'system_id',
        allowNull: false
      }
    });
  };

  return System;
}
