const images = require('express').Router();

// const single = require('./single');
// albums.get('/:name', single);

const deleteImage = require('./route.admin.images.delete');
images.post('/delete', deleteImage);

module.exports = images;
