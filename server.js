// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var settings = require('./config/config.settings');

var path = require('path');

var fs = require('fs');


// configuration ===============================================================
mongoose.connect(settings.mongoUrl); // connect to our database

require('./config/config.passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(express.static(path.join(__dirname, 'public')));// set public path


// required for passport
app.use(session({
    secret: settings.passportSecret, // session secret
    resave: true,
    saveUninitialized: false
}));
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
// require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.get('/', (req, res) => {
  res.render('index.ejs');
});
// show the login form
app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: req.flash('loginMessage') });
});
// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/home', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
// show the signup form
app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', { message: req.flash('signupMessage') });
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

const routes = require('./routes/route.index');
app.use('/', [isLoggedIn, routes]);

// Check if the album and album_thumbail folders exist. If not, throw an error
if(!fs.existsSync(settings.pathAlbums)){
    throw new Error("Album folder does not exist. Check your config.settings.js")
}
if(!fs.existsSync(settings.pathThumbnails)){
    throw new Error("Thumbnail folder does not exist. Check your config.settings.js")
}


// launch ======================================================================

// http server
var http = require('http');
http.createServer(app).listen(settings.httpPort);
console.log('(HTTP) The magic happens on port ' + settings.httpPort);

// https server
if(settings.allowHttps){
    var https = require('https');
    var options = {
        key: fs.readFileSync('./keys/client-key.pem'),
        cert: fs.readFileSync('./keys/client-cert.pem')
    };  
    https.createServer(options, app).listen(settings.httpsPort);
    console.log('(HTTPS) The safe magic happens on port ' + settings.httpsPort);
}



