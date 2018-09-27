const Album = require('../../../app/models/model.album');

module.exports = (req, res) => {
  Album.find({}, function(err, albums){
    // Image.aggregate([
    //   {"$group" : {_id:"$source", count:{$sum:1}}}
    // ])    
    res.render('admin/pages/albums/all', {
      user : req.user,
      albums: albums
    });
  });
};
