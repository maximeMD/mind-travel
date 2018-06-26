var fs = require('fs');
var thumb = require('node-thumbnail').thumb;

var settings = require('../../config/config.settings');


module.exports = {
  createThumb: function(album){
    thumb({
      source: '../../'+settings.pathAlbums+album,
      destination: '../../'+settings.pathThumbnails+album
    }).then(function() {
      console.log('Success');
    }).catch(function(e) {
      console.log('Error', e.toString());
    });
  }
};
