const images = require('express').Router();

const single = require('./single');
albums.get('/:name', single);


module.exports = albums;
