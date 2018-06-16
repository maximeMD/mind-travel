const Album = require('../../app/models/model.album');
const Image = require('../../app/models/model.image');

module.exports = (req, res) => {
  Album.findById(req.params.id, function(err, album){
    Image.find({'album':album.id}, function(err, images){
      res.render('pages/albums/single', {
        user : req.user,
        images: images
      });
    });
  });
};
