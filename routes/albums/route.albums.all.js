const Album = require('../../app/models/model.album');

module.exports = (req, res) => {
  Album.find({}, function(err, albums){
    res.render('pages/albums/all', {
      nav : "albums",
      user : req.user,
      albums: albums
    });
  });
};
