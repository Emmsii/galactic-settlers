module.exports = function(sequelize, Sequelize) {
  var System = sequelize.define('System', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
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
    collate: 'utf8_unicode_ci'
  });

  System.associate = (models) => {
    System.hasMany(models.Planet, {
      foreignKey: {
        name: "system_id",
        allowNull: false
      }
    });
  };

  return System;
}
