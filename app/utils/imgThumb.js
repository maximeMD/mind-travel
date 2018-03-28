// var im = require('imagemagick');
// im.identify('public/album/boom/IMG_1779.jpg', function(err, features){
//   if (err) throw err;
//   console.log(features);
//   // { format: 'JPEG', width: 3904, height: 2622, depth: 8 }
// });

var fs = require('fs');
var thumb = require('node-thumbnail').thumb;
var resources = require('../../config/resources.js');

// var resources = require('../../config/resources.js');

module.exports = {
  createThumb: function(album){
    thumb({
      source: '../../'+resources.album+album,
      destination: '../../'+resources.thumbnails+album
    }).then(function() {
      console.log('Success');
    }).catch(function(e) {
      console.log('Error', e.toString());
    });
  }
};
