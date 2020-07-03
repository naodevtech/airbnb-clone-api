const express = require('express');
const authRouter = require('./authRoutes');
const placeRouter = require('./places');
const cityRouter = require('./cities');
// Imporation de la methode Router() pour découper nos routes
const router = express.Router();
const db = require('../models');

router.use(authRouter);
router.use(placeRouter);
router.use(cityRouter);

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  });
});

router.get('/users', (req, res) => {
  db.User.findAll({}).then((Users) => res.json(Users));
});

router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Erreur 404 ❌',
  });
});

module.exports = router;
