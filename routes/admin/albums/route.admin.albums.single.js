const Album = require('../../../app/models/model.album');
const Image = require('../../../app/models/model.image');

module.exports = (req, res) => {
  Image.find({'album':req.params.name}, function(err, images){
    res.render('admin/pages/albums/single', {
      user : req.user,
      images: images,
      album: req.params.name
    });
  });
};
