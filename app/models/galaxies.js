module.exports = function(sequelize, Sequelize) {
  var Galaxy = sequelize.define('Galaxy', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    max_players: {
      type: Sequelize.SMALLINT.UNSIGNED,
      allowNull: false
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscores: true
  });

  return Galaxy;
}
