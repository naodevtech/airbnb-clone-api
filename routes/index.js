const express = require('express');

// Imporation de la methode Router() pour découper nos routes
const router = express.Router();
const db = require('../models');
const apiRouter = require('../apiRouter');

router.use(apiRouter);

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  });
});

router.get('/users', (req, res) => {
  db.User.findAll({}).then((Users) => res.json(Users));
});

router.post('/users', (req, res) => {
  db.User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    avatar: req.body.avatar,
  }).then((user) => res.json(user));
});

router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Erreur 404 ❌',
  });
});

module.exports = router;
