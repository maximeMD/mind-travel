const Album = require('../../../app/models/model.album');
const Image = require('../../../app/models/model.image');

var settings = require('../../../config/config.settings');

const del = require('del');

module.exports = (req, res) => {
  try{    
    Image.findById(req.body.imageId, function(err, image){
      // if(err) throw err;
      Album.findById(image.album, function(err, album){
        // if(err) throw err;
        if(album.src_thumbnail == image.src_thumbnail){
          Image.findOne({'album' : album.id}, function(err,newImageThumb){
            // if(err) throw err;      
            Album.findByIdAndUpdate(album.id, {"src_thumbnail":newImageThumb.src_thumbnail}, function(err, result){
              // if(err) throw err; 
              console.log("Album thumbnail changed by first image");
            });
          });
        }
      });
      Image.findByIdAndRemove(image.id, function(err){
        if(err) throw err;
        console.log("Image removed from database");
        del(settings.pathAlbums+req.body.albumName+"/"+req.body.imageSrc).then(function(){console.log("Image file removed");});
        del(settings.pathThumbnails+req.body.albumName+"/"+req.body.imageSrcThumb).then(function(){console.log("Image thumbnail file removed");});
      });
    });
    res.redirect("/admin/albums/"+req.body.albumName);
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
};
