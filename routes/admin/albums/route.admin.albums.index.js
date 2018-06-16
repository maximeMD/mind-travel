const albums = require('express').Router();

const all = require('./route.admin.albums.all');
albums.get('/', all);

const single = require('./route.admin.albums.single');
albums.get('/:name', single);

const create = require('./route.admin.albums.create');
albums.post('/create', create);

const upload = require('./route.admin.albums.upload');
albums.post('/upload/:name', upload);

const deleteAlbum = require('./route.admin.albums.delete');
albums.post('/delete', deleteAlbum);

module.exports = albums;
