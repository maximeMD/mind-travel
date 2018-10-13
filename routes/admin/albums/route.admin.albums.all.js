const Album = require('../../../app/models/model.album');
const Image = require('../../../app/models/model.image');

module.exports = (req, res) => {
  try{
    Album.find({}, function(err, albums){
      Image.aggregate( [ { $group: { _id: "$album" , imgCount: { $sum: 1 } } } ], function(err, imgCounts){        
        res.render('admin/pages/albums/all', {
          nav: "albums",
          user : req.user,
          albums: albums,
          imgCounts: imgCounts
        });
      });
    });
  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
};
