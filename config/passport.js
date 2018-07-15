var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = function(passport, userModel) {

  var User = userModel;

  console.log(User);

  passport.serializeUser(function(user, done) {
    console.log('serialize');
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserialize');
    User.findById(id).then(function(user){
      if(user) done(null, user.get());
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
      }).then(function(user){
        if(user) return done(null, false, req.flash('signupMessage', 'That email is in use.'));
        else{
          var salt = bcrypt.genSaltSync(saltRounds);
          var hash = bcrypt.hashSync(password, salt);

          var data = {
            username: 'Bill',
            email: email,
            password: hash,
            salt: salt
          };

          User.create(data).then(function(newUser, created){
            if(!newUser) return done(null, false);
            else return done(null, newUser);
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
      var isValidPassword = function(password, hash){
        return bcrypt.compare(password, hash);
      }

      User.findOne({
        where: {
          email: email
        }
      }).then(function(user){
        if(!user) return done(null, false, req.flash('loginMessage', 'No user found.'));

        if(!isValidPassword(password, user.password)){
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
        }

        var userData = user.get();
        return done(null, userData);
      }).catch(function(err){
        console.log(err);
        return done(null, false, req.flash('loginMessage', 'Something when wrong during login.'));
      });
    }));
};
