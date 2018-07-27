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
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true
  });

  Galaxy.associate = (models) => {
    Galaxy.hasMany(models.System, {
      foreignKey: {
        name: "galaxy_id",
        allowNull: false,
        onDelete: 'RESTRICT'
      }
    });
  };

  return Galaxy;
}
