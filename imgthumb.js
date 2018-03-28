
var thumb = require('node-thumbnail').thumb;

thumb({
  source: 'private/album/psyfi2017',
  destination: 'private/album_thumbnail/psyfi2017'
}).then(function() {
  console.log('Success');
}).catch(function(e) {
  console.log('Error', e.toString());
});
