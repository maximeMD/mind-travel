const routes = require('express').Router();

routes.get('/home', (req, res) => {
  res.render('pages/home.ejs', { user: req.user });
});

const albums = require('./albums/routes.albums.index');
routes.use('/albums', albums);

const admin = require('./admin/routes.admin.index');
routes.use('/admin', admin);

module.exports = routes;
