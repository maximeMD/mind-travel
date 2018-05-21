const albums = require('express').Router();

const all = require('./all');
albums.get('/', all);

const single = require('./single');
albums.get('/:name', single);

const create = require('./create');
albums.post('/create', create);

const upload = require('./upload');
albums.post('/upload/:name', upload);

module.exports = albums;
