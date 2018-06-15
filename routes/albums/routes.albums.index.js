const albums = require('express').Router();

const all = require('./routes.albums.all');
albums.get('/', all);

const single = require('./routes.albums.single');
albums.get('/:name', single);

module.exports = albums;
