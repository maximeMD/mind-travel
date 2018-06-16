// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var imageSchema = mongoose.Schema({

  src: String,
  src_thumbnail: String,
  width: Number,
  height: Number,
  album: String

});

// methods ======================
// generating a hash
// imageSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// create the model for users and expose it to our app
module.exports = mongoose.model('Image', imageSchema);
