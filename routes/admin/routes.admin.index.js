const admin = require('express').Router();

admin.get('/', (req, res) => {
  res.render('admin/index');
});

const albums = require('./albums/routes.admin.albums.index');
admin.use('/albums', albums);

const images = require('./images/routes.admin.images.index');
admin.use('/images', images);

module.exports = admin;