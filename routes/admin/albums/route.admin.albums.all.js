const Album = require('../../../app/models/model.album');

module.exports = (req, res) => {
  try{
    Album.find({}, function(err, albums){
      res.render('admin/pages/albums/all', {
        nav: "albums",
        user : req.user,
        albums: albums
      });
    });
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
};
