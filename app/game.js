var model = require('./models/index.js');

var Galaxy = model.Galaxy;
var System = model.System;
var Planet = model.Planet;

var galaxyData = {
  max_players: 100,
  max_planets_per_system: 6,
  system_chance: 0.1,
  width: 100,
  height: 100
};

var config = {
  min_joinable_galaxies: 4
};

function createGalaxy(data) {
  Galaxy.create(data)
    .then((newGalaxy, created) => {

      var systems = [];

      for (var y = -(data.height / 2); y < data.height / 2; y++) {
        for (var x = -(data.width / 2); x < data.width / 2; x++) {
          if (Math.random() <= data.system_chance) {
            var newSystem = {
              galaxy_id: newGalaxy.id,
              x: x,
              y: y
            };

            systems.push(newSystem);
          }
        }
      }

      System.bulkCreate(systems, {
          returning: true
        })
        .then((result) => {

          var planets = [];

          result.forEach((system) => {
            for (var i = 0; i < data.max_planets_per_system; i++) {
              var newPlanet = {
                system_id: system.id,
                size: Math.ceil(Math.random() * 5),
                dark_matter: 500,
                metals: 1000
              };

              planets.push(newPlanet);
            }
          });

          Planet.bulkCreate(planets)
            .then((result) => {
              console.log('planets done');

              Galaxy.update({
                active: true
              },{
                where: {
                  id: newGalaxy.id
                }
              });
            });
        });
    });
}

function init() {


  model.sequelize.query('CALL getGalaxiesAndUserCounts();')
    .then((result) => {
      console.log(result.length + ' galaxies found.');

      var joinable = 0;

      for(var i = 0; i < result.length; i++){
        if(result[i].current_players < result[i].max_players){
          joinable++;
        }
      }

      console.log(joinable + ' joinable.')

      var required = config.min_joinable_galaxies - joinable;
      if(required > 0){
        console.log('Creating ' + required + ' new galaxies.');
        for(var i = 0; i < required; i++){
          createGalaxy(galaxyData);
        }
      }

    });

  // for (var i = 0; i < 4; i++) {
  //   createGalaxy(galaxyData);
  // }




  // Galaxy.count({
  //     where: {}
  //   })
  //   .then(count => {
  //     if (count === 0) {
  //       Galaxy.create(galaxyData).then(function(newGalaxy, created) {
  //         if (!newGalaxy) {
  //           console.error('Error creating galaxy.');
  //           return false;
  //         }
  //@
  //         var systems = [];
  //         var planets = [];
  //
  //         for (var yp = 0; yp < 100; yp++) {
  //           for (var xp = 0; xp < 100; xp++) {
  //             if (Math.random() < 0.1) {
  //               var system = {
  //                 galaxy_id: newGalaxy.id,
  //                 x: xp,
  //                 y: yp,
  //               };
  //
  //               System.create(system).then(function(result){
  //                 var planets = [];
  //                 for(var i = 0; i < 6; i++){
  //                   var planet = {
  //                     size: Math.ceil(Math.random() * 5),
  //                     system_id: result.dataValues.id
  //                   };
  //                   planets.push(planet);
  //                 }
  //
  //                 Planet.bulkCreate(planets);
  //               });
  //             }
  //           }
  //         }
  //       });
  //     } else {
  //       console.log('galaxy already exists.');
  //     }
  //
  //   });

  return true;
}

module.exports.init = init;
