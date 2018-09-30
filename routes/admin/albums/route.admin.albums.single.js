const Album = require('../../../app/models/model.album');
const Image = require('../../../app/models/model.image');

module.exports = (req, res) => {
  Album.findById(req.params.id, function(err, album){
    if (err) throw err;
    Image.find({'album':album.id}, function(err, images){
      if (err) throw err;
      res.render('admin/pages/albums/single', {
        nav: "albums",
        user : req.user,
        images: images,
        album: album
      });
    });
  });
};
