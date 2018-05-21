const Album = require('../../../app/models/album');
const Image = require('../../../app/models/image');

const resources = require('../../../config/resources');

const del = require('del');

module.exports = (req, res) => {
  Album.findById(req.body.id, function(err, album){
      console.log(album);
      if (err) throw err;
      Image.deleteMany({'album':album.name}, function(err){
        if (err) throw err;
      });
      del(resources.albums+album.name).then(function(){console.log("album picture directory deleted");});
      del(resources.thumbnails+album.name).then(function(){console.log("album thumnails directory deleted");});
  });
  Album.findByIdAndRemove(req.body.id, function(){
    console.log("Album removed from database");
  });
  res.redirect("/admin/albums");
};
