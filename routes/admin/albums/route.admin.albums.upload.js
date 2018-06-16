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
  var currentAlbum = new Album();
  Album.findOne({'name':req.params.name}, function(err, album){
    currentAlbum = album;
  });

  var dirName = resources.albums+req.params.name;
  //create upload folders if it doesn't exists
  if (!fs.existsSync(dirName)){
      fs.mkdirSync(dirName);
  }
  if (!fs.existsSync(resources.thumbnails+req.params.name)){
      fs.mkdirSync(resources.thumbnails+req.params.name);
  }

  //define the storage for multer (upload module)
  var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, dirName);
    },
    filename: function (req, file, callback) {
      callback(null, req.params.name + '-' + Date.now() + "." + mime.getExtension(file.mimetype));
    }
  });
  //upload the files
  var upload = multer({ storage : storage }).array('userPhoto',500);
  upload(req,res,function(err){
    if (err) throw err;
    req.files.forEach(function(image){
      console.log(image);
      //upload to database
      var dimensions = sizeOf(resources.albums+req.params.name+'/'+image.filename);
      var img_doc = new Image({
        src: image.filename.split("."+mime.getExtension(image.mimetype),1) + "." + mime.getExtension(image.mimetype),
        src_thumbnail: image.filename.split("."+mime.getExtension(image.mimetype),1) +'_thumb' + "." + mime.getExtension(image.mimetype),
        width: dimensions.width,
        height: dimensions.height,
        album: req.params.name
      });
      img_doc.save(function (err) {
        if (err) return handleError(err);
        // saved!
      });
      // create thumb
      thumb({
        source: resources.albums+req.params.name+'/'+image.filename,
        destination: resources.thumbnails+req.params.name
      }, function(files, err, stdout, stderr) {
        console.log('All done!');
      });
      // set thumbnail to the album if it hasn't one yet
      if(currentAlbum.src === null){
        currentAlbum.src = image.filename.split("."+mime.getExtension(image.mimetype),1) +'_thumb' + "." + mime.getExtension(image.mimetype);
        Album.findByIdAndUpdate(currentAlbum.id, currentAlbum, function(err, updatedAlbum){
          if (err) throw err;
          console.log("thumbnail added to album " + updatedAlbum.name);
        });
      }
    });
    res.redirect("/admin/albums/"+req.params.name);
  });
};
