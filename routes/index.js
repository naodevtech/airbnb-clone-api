const express = require('express');
const { response } = require('..');

const router = express.Router();

router.get('/api', (req, res) => {
  res.send('ok');
});

router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Erreur 404 ❌',
  });
});

router.use((error, req, res, next) => {
  console.log(error);
  response.status(400).json({
    error: error.message,
  });
});

module.exports = router;
