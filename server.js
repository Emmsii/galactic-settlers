var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var handlebars = require('express-handlebars');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MySqlStore = require('express-mysql-session')(session);

var models = require('./app/models');
var dbConfig = require('./config/mysql.js');
var sessionStore = new MySqlStore(dbConfig);

var game = require('./app/game.js');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

var hbs = handlebars.create({
  helpers: {
    //https://wolfgang-ziegler.com/blog/a-scripts-section-for-your-handlebars-layout-template
    section: function(name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    },
    ifCond: function(v1, operator, v2, options) {
      switch (operator) {
        case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    }
  },
  defaultLayout: 'main',
  extname: '.hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(session({
  key: 'session_cookie',
  secret: 'secretcodes',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    }
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

models.sequelize.sync().then(function() {
  console.log('Database connection: OK');
  var initResult = game.init();
  console.log('Init result: ' + initResult);
}).catch(function(err) {
  console.log(err, 'Error connecting to database.');
});

require('./app/routes.js')(app, passport);
require('./config/passport')(passport, models);

app.listen(port, () => {
  console.log('Listening on port ' + port);
});
