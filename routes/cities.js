const express = require('express');

const cityController = require('../controllers/cities');

const cityRouter = express.Router();

cityRouter.post('/cities', cityController.addCity);

module.exports = cityRouter;
