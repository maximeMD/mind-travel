const admin = require('express').Router();

admin.get('/', (req, res) => {
  res.render('admin/index', {
    nav: "dashboard"
  }) ;
});

const albums = require('./albums/route.admin.albums.index');
admin.use('/albums', albums);

const images = require('./images/route.admin.images.index');
admin.use('/images', images);

const users = require('./users/route.admin.users.index');
admin.use('/users', users);

module.exports = admin;