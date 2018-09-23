const Album = require('../../../app/models/model.album');
const Image = require('../../../app/models/model.image');

module.exports = (req, res) => {

  Image.findById(req.body.imageId, function(err, image){
    // if(err) throw err;
    Album.findById(image.album, function(err, album){
      // if(err) throw err;
      Album.findByIdAndUpdate(image.album, {"src_thumbnail":image.src_thumbnail}, function(err, result){
        console.log("Album thumbnail changed succesfully");
      });      
    });    
    res.redirect("/admin/albums/"+image.album);
  });
};
