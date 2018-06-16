const admin = require('express').Router();

admin.get('/', (req, res) => {
  res.render('admin/index');
});

const albums = require('./albums/route.admin.albums.index');
admin.use('/albums', albums);

const images = require('./images/route.admin.images.index');
admin.use('/images', images);

module.exports = admin;