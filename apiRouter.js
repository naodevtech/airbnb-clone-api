// Imports
const express = require('express');
const usersCtrl = require('./routes/usersCtrl');

// Router
const apiRouter = express.Router();

apiRouter.post('/users/register/', usersCtrl.register);
// apiRouter.route('/users/login/').post(usersCtrl.login);

module.exports = apiRouter;
