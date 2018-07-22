var LocalStrategy = require('passport-local').Strategy;
// var CustomStrategy = require('passport-custom').Strategy;
var bcrypt = require('bcrypt');

const saltRounds = 12;

module.exports = function(passport, model) {

  var User = model.User;

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if (user) done(null, user.get());
      else done(user.errors, null);
    });
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      User.findOne({
        where: {
          email: email
        }
      }).then(function(user) {
        if (user) return done(null, false, req.flash('signupMessage', 'That email is in use.'));
        else {
          bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash) {
              model.sequelize.query('CALL getStartingSystem();')
                .then((result) => {
                  var data = {
                    email: email,
                    password: hash,
                    username: req.body.username,
                    home_system: result[0].id
                  };
                  User.create(data)
                    .then((newUser, created) => {
                      if (!newUser) return done(null, false);
                      else return done(null, newUser);
                    });
                });
            });
          });
        }

      });
    }));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      var isValidPassword = function(password, hash) {
        return bcrypt.compare(password, hash);
      }

      User.findOne({
        where: {
          email: email
        }
      }).then(function(user) {
        if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));

        if (!isValidPassword(password, user.password)) {
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
        }

        var userData = user.get();

        return done(null, userData);
      }).catch(function(err) {
        console.log(err);
        return done(null, false, req.flash('loginMessage', 'Something when wrong during login.'));
      });
    }));
};
