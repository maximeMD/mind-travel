const admin = require('express').Router();

admin.get('/', (req, res) => {
  res.render('admin/index');
});

const albums = require('./albums');
admin.use('/albums', albums);

const images = require('./images');
admin.use('/images', images);

module.exports = admin;
