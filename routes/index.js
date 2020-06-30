const express = require('express');
const authRouter = require('./authRoutes');
const dashboardRouter = require('./dashboardRoute');
// Imporation de la methode Router() pour découper nos routes
const router = express.Router();

router.use(authRouter);
router.use(dashboardRouter);

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  });
});

router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Erreur 404 ❌',
  });
});

module.exports = router;
