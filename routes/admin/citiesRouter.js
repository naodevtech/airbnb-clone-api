const express = require('express');

const citiesController = require('../../controllers/admin/citiesController');

const citiesRouter = express.Router();

citiesRouter.get('/cities', citiesController.getAllCities);
citiesRouter.post('/cities/update', citiesController.addCities);

module.exports = citiesRouter;
