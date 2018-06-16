const Album = require('../../../app/models/model.album');

module.exports = (req, res) => {
  Album.find({}, function(err, albums){
    res.render('admin/pages/albums/all', {
      user : req.user,
      albums: albums
    });
  });
};
