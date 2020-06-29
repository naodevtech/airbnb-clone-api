const express = require('express');

const router = express.Router();

router.get('/api', (req, res) => {
  res.send('ok');
});

router.use('*', (req, res) => {
  res.status(404);
});

module.exports = router;
