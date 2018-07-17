module.exports = function(sequelize, Sequelize) {
  var Planet = sequelize.define('Planet', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscores: true
  });

  Planet.associate = (models) => {
    Planet.hasMany(models.Building, {
      foreignKey: {
        name: "planet_id",
        allowNull: false
      }
    });
  };

  return Planet;
}
