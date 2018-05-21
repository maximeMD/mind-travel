const albums = require('express').Router();
const all = require('./all');

albums.get('/', all);

module.exports = albums;
