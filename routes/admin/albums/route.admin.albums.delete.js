const Album = require('../../../app/models/model.album');
const Image = require('../../../app/models/model.image');

var settings = require('../../../config/config.settings');

const del = require('del');

module.exports = (req, res) => {
  try{
    Album.findById(req.body.id, function(err, album){
      console.log(album);
      if (err) throw err;
      Image.deleteMany({'album':album.id}, function(err){
        if (err) throw err;
      });
      del(settings.pathAlbums+album.id).then(function(){console.log("album picture directory deleted");});
      del(settings.pathThumbnails+album.id).then(function(){console.log("album thumnails directory deleted");});
      Album.findByIdAndRemove(req.body.id, function(){
        console.log("Album removed from database");
      });
    });
    res.redirect("/admin/albums");
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
};
