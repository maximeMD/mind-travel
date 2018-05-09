module.exports = function(app, passport, db) {

    // app.get('/private/*', function(req,res){
    //   if(req.isAuthenticated()){
    //     // http://localhost:8080/private/album_thumbnail/boom/IMG_1694_thumb.jpg
    //     app.use('/private', express.static(path.join(__dirname, 'private')));
    //   }
    // });

    // app.use(function(req, res, next) {
    //     if (req.isAuthenticated())
    //     {
    //         res.redirect('/login');
    //     }
    //     next();
    // });

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

    app.get('/portfolio/:name', isLoggedIn, function(req, res){
      db.collection('images').find({'album':req.params.name}, function(err, images){
        var img_list = [];
        var i =0;
        images.forEach(function(image){
          img_list[i] = image;
          // console.log(img_list[i]);
          i++;
        }, function(){ //callbacl, waiting for the end of forEach
          // console.log(img_list);
          res.render('pages/portfolio.ejs', {
            user: req.user,
            img_list: img_list
          });
        });
      });

    });

    app.get('/albums', isLoggedIn, function(req, res){
      db.collection('album').find({}, function(err, albums){
        var album_list = []
        var i=0;
        albums.forEach(function(album){
          album_list[i] = album;
          i++;
        }, function(){ //callbacl, waiting for the end of forEach
          // console.log(img_list);
          res.render('pages/albums.ejs', {
            user: req.user,
            album_list: album_list
          });
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
      db.collection('album').find({}, function(err, albums){
        var album_list = []
        var i=0;
        albums.forEach(function(album){
          album_list[i] = album;
          i++;
        }, function(){ //callbacl, waiting for the end of forEach
          // console.log(img_list);
          res.render('admin/pages/albums', {
            user: req.user,
            album_list: album_list,
            data: {},
            error: {}
          });
        });
      });
    });
    app.post('/admin/albums', isLoggedIn, function(req, res){
      console.log(req.body);
      newAlbum = {
        "name": req.body.albumName,
        "src" : "test"
      };
      db.collection('album').insert(newAlbum);
      res.redirect('/admin/albums');
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
