var resources = require('../../config/config.resources.js');

var fs = require('fs');
var mongoose = require('mongoose');
var sizeOf = require('image-size');


var Image = require('../models/image.js');

var configDB = require('../../config/config.database.js');

var each = require('async-each');

module.exports = {
  insertAlbumImages: function(album){

    var img = fs.readdirSync(resources.albums+album+'/');

    var img_name = [];

    mongoose.connect(configDB.url);
    var db = mongoose.connection;


    for(var i=0; i<parseInt(img.length); i++){
      img_name[i] = img[i].split(".jpg",1)

      // console.log('public/'+img_list[i]);
      var dimensions = sizeOf(resources.albums+album+'/'+img[i]);

      var img_doc = new Image({
        src: img[i],
        src_thumbnail: img_name[i]+'_thumb.jpg',
        width: dimensions.width,
        height: dimensions.height,
        album: album
      });
      img_doc.save(function (err) {
        if (err) return handleError(err);
        // saved!
      })

      console.log(img_doc);
    }


    // console.log(img);
    // each(img, function(error, image, callback) {
    //   if (error) console.error(error);
    //
    //   // console.log('public/'+img_list[i]);
    //   var dimensions = sizeOf(resources.albums+album+'/'+image);
    //
    //   var img_doc = new Image({
    //     src: image,
    //     src_thumbnail: image.split(".jpg",1) +'_thumb.jpg',
    //     width: dimensions.width,
    //     height: dimensions.height,
    //     album: album
    //   });
    //   img_doc.save(function (err) {
    //     if (err) return handleError(err);
    //     console.log("saved"+image);
    //   })
    //
    //   // console.log(img_doc);
    // });

  }
};
