const Album = require('../../../app/models/model.album');
const Image = require('../../../app/models/model.image');

const resources = require('../../../config/config.resources');

const del = require('del');

module.exports = (req, res) => {
  Album.findById(req.body.id, function(err, album){
      console.log(album);
      if (err) throw err;
      Image.deleteMany({'album':album.id}, function(err){
        if (err) throw err;
      });
      del(resources.albums+album.id).then(function(){console.log("album picture directory deleted");});
      del(resources.thumbnails+album.id).then(function(){console.log("album thumnails directory deleted");});
      Album.findByIdAndRemove(req.body.id, function(){
        console.log("Album removed from database");
      });
  });
  res.redirect("/admin/albums");
};
