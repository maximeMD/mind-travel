const users = require('express').Router();

const allUsers = require('./route.admin.users.all');
users.get('/', allUsers);

const createUser = require('./route.admin.users.create');
users.post('/create', createUser);


module.exports = users;
