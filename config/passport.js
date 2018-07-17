var LocalStrategy = require('passport-local').Strategy;
var CustomStrategy = require('passport-custom').Strategy;
var bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = function(passport, userModel) {

  var User = userModel;

  console.log('usermodel: ' + User);

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

  passport.use('username-creation', new CustomStrategy(
    function(req, done){
      console.log('session user: ' + req.user.id);
      User.findOne({
        where:{
          username: req.body.username
        }
      }).then(function(user){
        if(user) return done(null, false, req.flash('usernameMessage', 'That username has been taken.'));
        else{
          var updatedUser = User.update({
            username: req.body.username
          },{
            where:{
              id: req.user.id
            },
            returning: true,
            plain: true
          }).then(function(result){
              User.findById(req.user.id).then(function(user){
                done(null, user);
              });
          });
        }
      });
    }
  ));

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      console.log('finding one: ' + email + ', ' + password);
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

        if(!userData.username){
          // todo; REDIRECT TO USERNAME SELECT
        }

        return done(null, userData);
      }).catch(function(err){
        console.log(err);
        return done(null, false, req.flash('loginMessage', 'Something when wrong during login.'));
      });
    }));
};
