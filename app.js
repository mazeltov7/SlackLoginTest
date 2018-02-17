var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const session = require('express-session');
const Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config/config.json')[env];


var index = require('./routes/index');
var users = require('./routes/users');
var slack = require('./routes/slack');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// session系
const SequelizeStore = require('connect-session-sequelize')(session.Store);
if (config.use_env_variable) {
	var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
	var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

var Session = sequelize.define('Sessions', {
	sid: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	expires: Sequelize.DATE,
	data: Sequelize.STRING
});

app.use(session({
	secret: 'hoge',
	store: new SequelizeStore({
		db: sequelize,
		host: 'localhost',
		table: 'Sessions'
	}),
	resave: true,
	saveUninitialized: true
}));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/slack', slack);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
