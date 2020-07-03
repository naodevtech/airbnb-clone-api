const express = require('express');

const placeController = require('../controllers/places');

const placeRouter = express.Router();

placeRouter.post('/places', placeController.addPlace);

module.exports = placeRouter;
