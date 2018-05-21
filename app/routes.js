var multer = require('multer');
var fs = require('fs');
var thumb = require('node-thumbnail').thumb;
var sizeOf = require('image-size');
var mime = require('mime');

var imgDb = require('../app/utils/imgDb.js');

var resources = require('../config/resources.js');

var Album = require('./models/album');
var Image = require('./models/image');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
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

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.get('/home', isLoggedIn, function(req, res) {
        res.render('pages/home.ejs', { user: req.user });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/album/:name', isLoggedIn, function(req, res){
      Image.find({'album':req.params.name}, function(err, images){
        res.render('pages/album', {
          user : req.user,
          images: images
        });
      });

    });

    app.get('/albums', isLoggedIn, function(req, res){
      Album.find({}, function(err, albums){
        res.render('pages/albums', {
          user : req.user,
          albums: albums
        });
      });
    });

    app.get('/kaleidoscope', function(req, res){
      res.render('kaleidoscope.ejs');
    });

    app.get('/admin', isLoggedIn, function(req, res){
      res.render('admin/index');
    });

    app.get('/admin/albums', isLoggedIn, function(req, res){
      Album.find({}, function(err, albums){
        res.render('admin/pages/albums', {
          user : req.user,
          albums: albums
        });
      });
    });
    app.post('/admin/album/create', isLoggedIn, function(req, res){
      var newAlbum = new Album({
        "name": req.body.albumName,
        "src" : null
      });
      newAlbum.save(function(err){
        if (err) throw err;
        console.log("Album save success");
      });
      res.redirect('/admin/albums');
    });
    app.post('/admin/album/delete', isLoggedIn, function(req, res){
      Album.findByIdAndRemove(req.body.id, function(err){
        if(err) throw err;
        console.log("Album deleted");
      })
      res.redirect('/admin/albums');
    });
    app.post('/admin/album/update', isLoggedIn, function(req, res){
      Album.findByIdAndUpdate(req.body.id, function(err, album){
        if(err) throw err;
        console.log("Album updated");
      })
    })

    app.get('/admin/album/:name', isLoggedIn, function(req, res){
      Image.find({'album':req.params.name}, function(err, images){
        res.render('admin/pages/album', {
          user : req.user,
          images: images,
          album: req.params.name
        });
      });
    });

    app.get('/admin/album/delete/:id', isLoggedIn, function(req,res){
      User.findById(req.params.id, function(req,res){
        res.redirect("/admin/albums");
      });
    });

    app.post('/admin/album/upload/:name', isLoggedIn, function(req,res){
      //find the corresponding Album in database
      var currentAlbum = new Album();
      Album.findOne({'name':req.params.name}, function(err, album){
        currentAlbum = album;
      });

      var dirName = resources.albums+req.params.name;
      //create upload folders if it doesn't exists
      if (!fs.existsSync(dirName)){
          fs.mkdirSync(dirName);
      }
      if (!fs.existsSync(resources.thumbnails+req.params.name)){
          fs.mkdirSync(resources.thumbnails+req.params.name);
      }

      //define the storage for multer (upload module)
      var storage =   multer.diskStorage({
        destination: function (req, file, callback) {
          callback(null, dirName);
        },
        filename: function (req, file, callback) {
          callback(null, req.params.name + '-' + Date.now() + "." + mime.getExtension(file.mimetype));
        }
      });
      //upload the files
      var upload = multer({ storage : storage }).array('userPhoto',500);
      upload(req,res,function(err){
        if (err) throw err;
        req.files.forEach(function(image){
          console.log(image);
          //upload to database
          var dimensions = sizeOf(resources.albums+req.params.name+'/'+image.filename);
          var img_doc = new Image({
            src: image.filename.split("."+mime.getExtension(image.mimetype),1) + "." + mime.getExtension(image.mimetype),
            src_thumbnail: image.filename.split("."+mime.getExtension(image.mimetype),1) +'_thumb' + "." + mime.getExtension(image.mimetype),
            width: dimensions.width,
            height: dimensions.height,
            album: req.params.name
          });
          img_doc.save(function (err) {
            if (err) return handleError(err);
            // saved!
          });
          // create thumb
          thumb({
            source: resources.albums+req.params.name+'/'+image.filename,
            destination: resources.thumbnails+req.params.name
          }, function(files, err, stdout, stderr) {
            console.log('All done!');
          });
          // set thumbnail to the album if it hasn't one yet
          if(currentAlbum.src === null){
            currentAlbum.src = image.filename.split("."+mime.getExtension(image.mimetype),1) +'_thumb' + "." + mime.getExtension(image.mimetype);
            Album.findByIdAndUpdate(currentAlbum.id, currentAlbum, function(err, updatedAlbum){
              if (err) throw err;
              console.log("thumbnail added to album " + updatedAlbum.name);
            });
          }
        });
        res.redirect("/admin/album/"+req.params.name);
      });
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        return next();
      }
    // if they aren't redirect them to the home page
    res.redirect('/');
}
