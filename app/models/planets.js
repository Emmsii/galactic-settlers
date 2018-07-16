module.exports = function(sequelize, Sequelize){
  var Planet = sequelize.define('planets', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    }
  });

  return Planet;
}
