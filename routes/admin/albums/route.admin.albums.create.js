const Album = require('../../../app/models/model.album');

module.exports = (req, res) => {
  var newAlbum = new Album({
    "name": req.body.albumName,
    "src" : null
  });
  newAlbum.save(function(err){
    if (err) throw err;
    console.log("Album save success");
  });
  res.redirect('/admin/albums');
};
