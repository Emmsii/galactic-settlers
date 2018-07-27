module.exports = function(sequelize, Sequelize) {
  var Planet = sequelize.define('Planet', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    size: {
      type: Sequelize.TINYINT.UNSIGNED,
      allowNull: false
    },
    metals: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    },
    dark_matter: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true
  });

  Planet.associate = (models) => {
    Planet.hasMany(models.Building, {
      foreignKey: {
        name: "planet_id",
        allowNull: false,
        onDelete: 'RESTRICT'
      }
    });
  };

  return Planet;
}
