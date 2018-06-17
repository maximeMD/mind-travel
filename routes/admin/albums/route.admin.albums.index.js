const albums = require('express').Router();

const listAlbums = require('./route.admin.albums.all');
albums.get('/', listAlbums);

const createAlbum = require('./route.admin.albums.create');
albums.post('/create', createAlbum);

const deleteAlbum = require('./route.admin.albums.delete');
albums.post('/delete', deleteAlbum);

const single = require('./route.admin.albums.single');
albums.get('/:id', single);


module.exports = albums;
