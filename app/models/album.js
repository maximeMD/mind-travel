// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var albumSchema = mongoose.Schema({

  name: String,
  src: String

});

// create the model for album and expose it to our app
module.exports = mongoose.model('Album', imageSchema);
