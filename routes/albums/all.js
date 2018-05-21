const Album = require('../../app/models/album');

module.exports = (req, res) => {
  Album.find({}, function(err, albums){
    // res.render('pages/albums', {
    //   user : req.user,
    //   albums: albums
    // });
    res.status(200).json({ albums });
  });
};
