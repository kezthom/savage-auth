// server.js

// set up ======================================================================
// get all the tools we need
// 
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;// looks for open port process.env in case 8080 was not available
const MongoClient = require('mongodb').MongoClient // mongoclient allows for making connection to mongoDB
var mongoose = require('mongoose');
var passport = require('passport'); // authenticate requests caters toward logins, local stra
var flash    = require('connect-flash');
// enhance ui interaction and animations provide feedabck
var morgan       = require('morgan'); // login library for node js for http re
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser'); // helps server read and use the data
var session      = require('express-session');

var configDB = require('./config/database.js'); // send you to login for database

var db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2021b', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
