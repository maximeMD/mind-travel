const albums = require('express').Router();

const all = require('./routes.admin.albums.all');
albums.get('/', all);

const single = require('./routes.admin.albums.single');
albums.get('/:name', single);

const create = require('./routes.admin.albums.create');
albums.post('/create', create);

const upload = require('./routes.admin.albums.upload');
albums.post('/upload/:name', upload);

const deleteAlbum = require('./routes.admin.albums.delete');
albums.post('/delete', deleteAlbum);

module.exports = albums;
