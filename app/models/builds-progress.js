module.exports = function(sequelize, Sequelize) {
  var BuildsProgress = sequelize.define('BuildsProgress', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    building_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    },
    started_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    time_required: {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    }
  }, {
    charset: 'utf8',
    collate: 'utf8_unicode_ci',
    underscored: true,
    timestamps: false,
    tableName: 'builds_progress'
  });

  return BuildsProgress;
}
