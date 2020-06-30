const express = require('express');
const authController = require('../controllers/authController');

const authRouter = express.Router();

authRouter.get('/signup', authController.register);

module.exports = authRouter;
