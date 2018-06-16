// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
var albumSchema = new Schema({

  name: String,
  thumb: String

});

// albumSchema.methods.testy = function(){
//   this.name = this.name+"testtest";
//   return this.name;
// }

// create the model for album and expose it to our app
module.exports = mongoose.model('Album', albumSchema);
