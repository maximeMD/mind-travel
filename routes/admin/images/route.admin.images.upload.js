const Album = require('../../../app/models/model.album');
const Image = require('../../../app/models/model.image');

var multer = require('multer');
var fs = require('fs');
var thumb = require('node-thumbnail').thumb;
var sizeOf = require('image-size');
var mime = require('mime');

var resources = require('../../../config/config.resources');

module.exports = (req, res) => {
  //find the corresponding Album in database

  Album.findById(req.params.id, function(err, album){
    if (err) throw err;

    var dirName = resources.albums+album.id;
    //create upload folders if it doesn't exists
    if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
    }
    if (!fs.existsSync(resources.thumbnails+album.id)){
        fs.mkdirSync(resources.thumbnails+album.id);
    }
  
    //define the storage for multer (upload module)
    var storage =   multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, dirName);
      },
      filename: function (req, file, callback) {
        callback(null, album.name + "_" + Math.random().toString(36).substr(2, 9) + "." + mime.getExtension(file.mimetype));
      }
    });
    //upload the files
    var upload = multer({ storage : storage }).array('userPhoto',1000);
    upload(req,res,function(err){
      if (err) throw err;
      req.files.forEach(function(image){
        //upload to database
        var dimensions = sizeOf(dirName+'/'+image.filename);
        var img_doc = new Image({
          src: image.filename.split("."+mime.getExtension(image.mimetype),1) + "." + mime.getExtension(image.mimetype),
          src_thumbnail: image.filename.split("."+mime.getExtension(image.mimetype),1) +'_thumb' + "." + mime.getExtension(image.mimetype),
          width: dimensions.width,
          height: dimensions.height,
          album: album.id
        });
        img_doc.save(function (err) {
          if (err) return handleError(err);
          console.log(image.filename + ' : Image saved');
        });
        // create thumb
        thumb({
          source: dirName +'/'+image.filename,
          destination: resources.thumbnails+album.id
        }, function(files, err, stdout, stderr) {
          console.log(image.filename + ' : Thumb created');
        });
        // set thumbnail to the album if it hasn't one yet
        if(album.src_thumbnail === "0"){
          album.src_thumbnail = image.filename.split("."+mime.getExtension(image.mimetype),1) +'_thumb' + "." + mime.getExtension(image.mimetype);
          Album.findByIdAndUpdate(album.id, album, function(err, updatedAlbum){
            if (err) throw err;
            console.log("Thumbnail added to album " + updatedAlbum.name);
          });
        }
      });
      res.redirect("/admin/albums/"+album.id);
    });
  });

};
