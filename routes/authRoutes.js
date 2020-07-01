const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post('/signup', authController.register);

authRouter.post('/signin', authController.login);

module.exports = authRouter;
