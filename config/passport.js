var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var mysql = require('mysql');

var dbConfig = require('./database.js');
var connection = mysql.createConnection(dbConfig);

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

      // console.log('checking...');
      // var findUserQuery = 'SELECT * FROM users WHERE email = ?';
      // connection.query(findUserQuery, [email], function(err, results) {
      //   console.log('queried');
      //   if (err) {
      //     console.log(err);
      //     done(err);
      //   }
      //
      //   if (results.length !== 0) return done(null, false, req.flash('signupMessage', 'That email is in use.'));
      //
      //   var salt = bcrypt.genSaltSync(saltRounds);
      //   var hash = bcrypt.hashSync(password, salt);
      //
      //   var user = {
      //     username: 'Bill',
      //     email: email,
      //     password: hash,
      //     salt: salt,
      //   };
      //
      //   var newUserQuery = 'INSERT INTO users SET ?';
      //   connection.query(newUserQuery, user, function(err, results) {
      //     if (err) throw (err);
      //     user.id = results.insertId;
      //     return done(null, user);
      //   });
      // });
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
      })

      // var findUserQuery = 'SELECT * FROM users WHERE email = ?';
      // connection.query(findUserQuery, [email], function(err, results, fields) {
      //   if (err) return done(err);
      //
      //   if (results.length === 0) return done(null, false, req.flash('loginMessage', 'No user found.'));
      //
      //   var user = results[0];
      //   var salt = user.salt;
      //   bcrypt.compare(password, user.password, function(err, res){
      //     if(res) return done(null, user);
      //     else return done(null, false, req.flash('loginMessage', 'Wrong password.'));
      //   });
      // });
    }));
};
