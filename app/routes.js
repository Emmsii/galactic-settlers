var model = require('./models/index.js');
var gameData = require('../config/gamedata.js');

module.exports = function(app, passport) {
  var User = model.User;
  var Galaxy = model.Galaxy;
  var System = model.System;
  var Planet = model.Planet;
  var Building = model.Building;

  app.get('/planet/:id', function(req, res) {
    Planet.findById(req.params.id)
      .then((planet) => {

        Building.findAll({
          where: {
            planet_id: planet.id
          }
        }).then((buildings) => {

          // clone the original game data object
          var buildingTypes = JSON.parse(JSON.stringify(gameData.buildingTypes));

          for (var i = 0; i < buildingTypes.length; i++) {
            buildingTypes[i].canBuild = canPlanetBuild(buildingTypes[i], planet);
            buildingTypes[i].level = 0;
            buildingTypes[i].planet_id = planet.id;
          }

          for (var i = 0; i < buildings.length; i++) {
            buildingTypes[buildings[i].type_id].level = buildings[i].level;
            buildingTypes[buildings[i].type_id].uid = buildings[i].id;
          }

          res.render('planet', {
            planet: planet,
            buildings: buildingTypes
          });
        });


      });
  });

  app.post('/planet/:planet_id/build/:type_id', isLoggedIn, function(req, res) {

    // >> Steps to build a planet
    // 1. (SELECT) Check if the building type already exists on planet
    // a. If YES return message
    // 2. (SELECT) Check if the building is already being built
    // a. If YES return message
    // 2. (SELECT) Check if the planet has enough resources to build the building
    // a. If NO return message
    // 3. (UPDATE) Remove n amount of resources from the planet
    // 4. (INSERT) Add the building to the builds_in_progress table
    // 5. Return the updated planet data
    var planetId = req.params.planet_id;
    var buildingTypeId = req.params.type_id;
    console.log('creating building...');
    Building.findAll({
        where: {
          planet_id: planetId
        }
      })
      .then(buildingInst => {

        if (buildingInst) {
          console.log('building already exists');
          sendJsonResultMessage(res, 'failure', 'Building already exists');
          throw new Error('01');
        }
        console.log('building does not exist')
        var buildingData = buildingInst.get();

        BuildsProgress.findAll({
            where: {
              building_id: buildingData.id
            }
          })
          .then(buildProgressInst => {
            if (buildProgressInst) {
              console.log('building already being built');
              sendJsonResultMessage(res, 'failure', 'Building is already being built.');
              throw new Error('02');
            }
            console.log('building is not already being built');
            return buildingData;
          });
      })
      .then(buildingData => {
        var build
      })
      .catch(() => {
        // it's fine
      });
    // var planetId = req.params.planet_id;
    // var typeId = req.params.type_id;
    //
    // Building.findAll({
    //   where: {
    //     planet_id: planetId,
    //     type_id: typeId
    //   }
    // }).then((result) => {
    //   if (result[0]) {
    //     res.setHeader('Content-Type', 'application/json');
    //     res.send(JSON.stringify({
    //       result: "failure",
    //       message: "Building of that type already exists."
    //     }));
    //   } else {
    //
    //     Planet.findById(planetId)
    //       .then((planet) => {
    //         if (canPlanetBuild(gameData.buildingTypes[typeId], planet)) {
    //
    //           var newDarkMatter = planet.dark_matter - gameData.buildingTypes[typeId].costs.dark_matter;
    //           var newMetals = planet.metals - gameData.buildingTypes[typeId].costs.metals;
    //
    //           Planet.update({
    //               dark_matter: newDarkMatter,
    //               metals: newMetals
    //             }, {
    //               where: {
    //                 id: planetId
    //               }
    //             })
    //             .then((result) => {
    //               var newBuilding = {
    //                 type_id: typeId,
    //                 planet_id: planetId,
    //                 level: 1
    //               };
    //
    //               // Building.create(newBuilding)
    //               //   .then((result) => {
    //               //     res.setHeader('Content-Type', 'application/json');
    //               //     res.send(JSON.stringify({
    //               //       result: "success",
    //               //       message: "Building created.",
    //               //       data: result
    //               //     }));
    //               //   });
    //             });
    //         } else {
    //           res.setHeader('Content-Type', 'application/json');
    //           res.send(JSON.stringify({
    //             result: "failure",
    //             message: "Not enough resources."
    //           }));
    //         }
    //       });
    //
    //
    //   }
    // });
  });

  app.post('/planet/:planet_id/upgrade/:building_id', function(req, res) {
    Building.findById(req.params.building_id)
      .then((building) => {


        model.sequelize.query('CALL upgradeBuilding(building_id)')
      });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      result: "success"
    }));
  });

  app.get('/system/:id', function(req, res) {
    System.findById(req.params.id)
      .then((system) => {
        Planet.findAll({
          where: {
            system_id: system.id
          }
        }).then((planets) => {
          res.render('system', {
            system: system,
            planets: planets
          });
        });
      });
  });

  app.get('/galaxyselect', isLoggedIn, function(req, res) {
    model.sequelize.query('CALL getGalaxiesAndUserCounts();')
      .then(function(galaxiesFound) {
        res.render('galaxyselect', {
          galaxies: galaxiesFound
        });
      });
  });

  app.post('/galaxyselect', isLoggedIn, function(req, res) {
    req.user.current_galaxy = req.body.id;
    User.update({
      current_galaxy: req.body.id
    }, {
      where: {
        id: req.user.id
      }
    }).then(function(result) {
      res.redirect('/profile');
    });
  });

  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/login', function(req, res) {
    res.render('login', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));

  app.get('/signup', function(req, res) {
    res.render('signup', {
      message: req.flash('signupMessage')
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }));

  app.get('/profile', isLoggedIn, needsToChooseGalaxy, function(req, res) {
    res.render('profile', {
      user: req.user
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

function sendJsonResultMessage(res, result, message, data) {

  var jsonObject = {
    result: result,
    message: message
  }

  if (data) jsonObject.data = data;

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(jsonObject));
}

function canPlanetBuild(type, planet) {
  console.log('---');
  console.log(planet.dark_matter + " & " + planet.metals);
  console.log(type.costs.dark_matter + " & " + type.costs.metals);

  return planet.dark_matter >= type.costs.dark_matter && planet.metals >= type.costs.metals;
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

function needsToChooseGalaxy(req, res, next) {
  if (req.user.current_galaxy) return next();
  res.redirect('/galaxyselect');
}
