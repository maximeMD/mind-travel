const Album = require('../../../app/models/model.album');
const Image = require('../../../app/models/model.image');

var multer = require('multer');
var fs = require('fs');
var thumb = require('node-thumbnail').thumb;
var sizeOf = require('image-size');
var mime = require('mime');

var settings = require('../../../config/config.settings');

module.exports = (req, res) => {
  try{
    var albumId;
    var dirName;

    //find the corresponding Album in database
    Album.findById(req.params.id, function(err, album){
      if (err) throw err;
      
      albumId = album.id;

      dirName = settings.pathAlbums+album.id;
      //create upload folders if it doesn't exists
      if (!fs.existsSync(dirName)){
        fs.mkdirSync(dirName);
      }
      if (!fs.existsSync(settings.pathThumbnails+album.id)){
        fs.mkdirSync(settings.pathThumbnails+album.id);
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
          // set thumbnail to the album if it hasn't one yet
          if(album.src_thumbnail === "0"){
            album.src_thumbnail = image.filename.split("."+mime.getExtension(image.mimetype),1) +'_thumb' + "." + mime.getExtension(image.mimetype);
            Album.findByIdAndUpdate(album.id, album, function(err, updatedAlbum){
              if (err) throw err;
              console.log("Thumbnail added to album " + updatedAlbum.name);
            });
          }
        });
        // create thumb
        thumb({
          source: settings.pathAlbums + albumId,
          destination: settings.pathThumbnails + albumId,
          concurrency: 1
        }, function(files, err, stdout, stderr) {
          console.log('Thumbs created');
          res.redirect("/admin/albums/"+albumId);
        });  
      });
    }).then(function(){
      
    });


  } catch (error) {
    res.status(500).json({error: error.toString()});
  }
    
};
  