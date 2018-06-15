const Album = require('../../../app/models/album');
const Image = require('../../../app/models/image');

const resources = require('../../../config/resources');

const del = require('del');

module.exports = (req, res) => {

  Image.findByIdAndRemove(req.body.imageId, function(err){
    if(err) throw err;
    console.log("Image removed from database");
  });

  res.redirect("/admin/albums/"+req.body.albumName);
};
