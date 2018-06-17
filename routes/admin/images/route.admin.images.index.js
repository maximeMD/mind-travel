const images = require('express').Router();

// const single = require('./single');
// albums.get('/:name', single);

const deleteImage = require('./route.admin.images.delete');
images.post('/delete', deleteImage);

const uploadImages = require('./route.admin.images.upload');
images.post('/upload/:id', uploadImages);

module.exports = images;
