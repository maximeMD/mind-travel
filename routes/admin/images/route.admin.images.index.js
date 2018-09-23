const images = require('express').Router();


const deleteImage = require('./route.admin.images.delete');
images.post('/delete', deleteImage);

const uploadImages = require('./route.admin.images.upload');
images.post('/upload/:id', uploadImages);

const setAlbumThumb = require('./route.admin.images.setAlbumThumb');
images.post('/setAlbumThumb', setAlbumThumb);

module.exports = images;
