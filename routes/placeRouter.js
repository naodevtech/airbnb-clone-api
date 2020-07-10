const express = require('express');
const authController = require('../controllers/authController');
const placeController = require('../controllers/placesController');
const placesController = require('../controllers/placesController');

const placesRouter = express.Router();

placesRouter.get('/places/findBy', placeController.getPlacesByCity);

placesRouter.get('/places/:id', placeController.getPlaceById);

placesRouter.get('/places', placeController.getAllPlaces);

placesRouter.post('/places', (req, res) => {
  let userSession = {};
  authController.getUserSession(req, res, (userInfos) => {
    userSession = userInfos;
    if (userSession.role !== 'host') {
      return res.status(403).json({
        Message: "Vous n'êtes pas autorisé à accéder à cette ressource ❌",
      });
    }
    placeController.addPlace(req, res, userSession);
  });
});

placesRouter.delete('/places/:id', (req, res) => {
  let userSession = {};
  authController.getUserSession(req, res, (userInfos) => {
    userSession = userInfos;
    if (userSession.role !== 'host') {
      return res.status(403).json({
        Message:
          "Vous n'êtes pas autorisé à accéder à cette ressource en tant que visiteur ou touriste❌",
      });
    }
    placeController.deletePlace(req, res, userSession);
  });
});

placesRouter.patch('/places/:placeId', (req, res) => {
  let userSession = {};
  authController.getUserSession(req, res, (userInfos) => {
    userSession = userInfos;
    if (userSession.role !== 'host') {
      return res.status(403).json({
        Message:
          "Vous n'êtes pas autorisé à accéder à cette ressource en tant que visiteur ou touriste❌",
      });
    }
    placesController.updatePlaceValues(req, res, userSession);
  });
});

module.exports = placesRouter;
