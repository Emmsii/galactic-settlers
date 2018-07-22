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

  app.post('/planet/:planet_id/build/:type_id', function(req, res) {

    var planetId = req.params.planet_id;
    var typeId = req.params.type_id;

    Building.findAll({
      where: {
        planet_id: req.params.planet_id,
        type_id: req.params.type_id
      }
    }).then((result) => {
      if (result[0]) {
        console.log('building already exists.');
        console.log(result[0]);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
          result: "failure",
          message: "Building of that type already exists."
        }));
      } else {
        console.log('new building...');
        var newBuilding = {
          type_id: typeId,
          planet_id: planetId,
          level: 1
        };

        Building.create(newBuilding)
          .then((result) => {
            console.log('done');
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
              result: "success",
              message: "Building created.",
              data: result
            }));
          });
      }
    });
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
        // res.render('system', {
        //   system: result
        // });
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
