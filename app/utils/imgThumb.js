var fs = require('fs');
var thumb = require('node-thumbnail').thumb;
var resources = require('../../config/config.resources.js');

// var resources = require('../../config/config.resources.js');

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
