const routes = require('express').Router();

routes.get('/home', (req, res) => {
  res.render('pages/home.ejs', { 
    nav: "home",
    user: req.user 
  });
});

const albums = require('./albums/route.albums.index');
routes.use('/albums', albums);

const admin = require('./admin/route.admin.index');
routes.use('/admin', [isAdmin, admin]);

module.exports = routes;

// route middleware to make sure a user is Admin
function isAdmin(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.user.level == 0){
      return next();
    }
  // if they aren't admin, send them to hell
  res.send("You are not an administrator, little devil !");
  
}