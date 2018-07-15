module.exports = function(sequelize, Sequelize){
  var System = sequelize.define('systems', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    x: {
      type: Sequelize.SMALLINT
    },
    y: {
      type: Sequelize.SMALLINT
    }
  });

  return System;
}
