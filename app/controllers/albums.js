var express = require('express');
var router = express.Router();
var Album = require('../models/album');

// Albums page
router.get('/', function(req, res) {
  Album.find({}, function(err, albums){
    res.render('pages/albums', {
      user : req.user,
      albums: albums
    });
  });
})

module.exports = router
