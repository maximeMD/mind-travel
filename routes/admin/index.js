const admin = require('express').Router();

admin.get('/', (req, res) => {
  res.render('admin/index');
});

const albums = require('./albums');
admin.use('/albums', albums);

module.exports = admin;
