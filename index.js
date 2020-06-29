const express = require('express');
const morgan = require('morgan');

const router = require('./routes');

const PORT = 8000;

const server = express();
server.use(morgan('dev'));

server.use(router);

server.listen(PORT, () => {
  console.log(`Le serveur est lancé sur le port ${PORT} 🚀`);
});

module.exports = server;
