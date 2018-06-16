const albums = require('express').Router();

const all = require('./route.albums.all');
albums.get('/', all);

const single = require('./route.albums.single');
albums.get('/:id', single);

module.exports = albums;
