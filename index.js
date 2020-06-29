const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('hello');
  process.exit(1);
});

app.listen(3000, () => {
  console.log('Le serveur est lancé sur le port 3000');
});
