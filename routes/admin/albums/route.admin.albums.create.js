const Album = require('../../../app/models/model.album');

module.exports = (req, res) => {
  try{
    // Check if the album name is Alphanumeric
    if(/^([0-9]|[a-z])+([0-9a-z]+)$/i.test(req.body.albumName)){
      var newAlbum = new Album({
        "name": req.body.albumName,
        "src_thumbnail" : "0"
      });
      newAlbum.save(function(err){
        if (err) throw err;
        console.log("Album save success");
      });
      res.status(201).send('Album created with name : ' + newAlbum.name);
    }
    else{
      res.status(400).send("Album name must be composed with alphanumeric-only characters")
    }
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
};
