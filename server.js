// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var path = require('path');

// var imgThumb = require('./app/utils/imgThumb.js')
//
// // create thumb
// imgThumb.createThumb('psyfi2017');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static(path.join(__dirname, 'public')));// set public path


// required for passport
app.use(session({ secret: 'turnontuneinedropoutbytimleary' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// create db access to send to route
var db = mongoose.connection;

// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        return next();
      }

    // if they aren't redirect them to the home page
    res.redirect('/');
}


app.use('/private', [isLoggedIn, express.static(path.join(__dirname, 'private'))]);

// routes ======================================================================
require('./app/routes.js')(app, passport, db, express, path); // load our routes and pass in our app and fully configured passport


// app.use('/private', function(req,res,next){
//  if(req.isAuthenticated()){
//    return express.static(path.join(__dirname, 'private'));
//  } else {
//    // res.render('login.ejs');
//    res.send('Hello from D!');
//  }
// });

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

// var Album = require('./app/models/album');
// var albumtest = new Album({
//   name:"testname",
//   src:"testsrc"
// });
// albumtest.testy(function(err, name){
//   if(err) throw err;
//   console.log('Your new name is' + name);
// })
//
// albumtest.save(function(err){
//   if(err) throw err;
//   console.log("Album save success");
// })
