const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenue ! ',
  });
});

router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Erreur 404 ❌',
  });
});

module.exports = router;
