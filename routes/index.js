const routes = require('express').Router();

routes.get('/home', (req, res) => {
  res.render('pages/home.ejs', { user: req.user });
});

const albums = require('./albums');
routes.use('/albums', albums);

module.exports = routes;
