const users = require('express').Router();

const allUsers = require('./route.admin.users.all');
users.get('/', allUsers);

const createUser = require('./route.admin.users.create');
users.post('/create', createUser);

const deleteUser = require('./route.admin.users.delete');
users.post('/delete', deleteUser);

module.exports = users;
