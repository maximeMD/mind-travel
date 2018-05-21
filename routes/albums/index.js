const albums = require('express').Router();

const all = require('./all');
albums.get('/', all);

const single = require('./single');
albums.get('/:name', single);

module.exports = albums;
