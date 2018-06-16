const Album = require('../../../app/models/model.album');
const Image = require('../../../app/models/model.image');

const resources = require('../../../config/config.resources');

const del = require('del');

module.exports = (req, res) => {

  Image.findByIdAndRemove(req.body.imageId, function(err){
    if(err) throw err;
    console.log("Image removed from database");
    del(resources.albums+req.body.albumName+"/"+req.body.imageSrc).then(function(){console.log("Image file removed");});
    del(resources.thumbnails+req.body.albumName+"/"+req.body.imageSrcThumb).then(function(){console.log("Image thumbnail file removed");});
  });

  res.redirect("/admin/albums/"+req.body.albumName);
};
