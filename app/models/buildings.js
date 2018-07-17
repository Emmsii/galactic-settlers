module.exports = function(sequelize, Sequelize) {
  var Building = sequelize.define('Building', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    type_id: {
      type: Sequelize.SMALLINT.UNSIGNED,
      allowNull: false,
    },
    level: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscores: true
  });

  return Building;
}
