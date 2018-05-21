const Album = require('../../app/models/album');
const Image = require('../../app/models/image');

module.exports = (req, res) => {
  Image.find({'album':req.params.name}, function(err, images){
    res.render('pages/albums/single', {
      user : req.user,
      images: images
    });
  });
};
