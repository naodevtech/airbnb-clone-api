const models = require('../models');
const CITIES_JSON = require('../cities.json');

module.exports = {
  addCity: (req, res) => {
    for (let i = 0; i < CITIES_JSON.length; i += 1) {
      let newCity = models.City.create({
        name: CITIES_JSON[i].name,
      });
    }
    res.status(201).json({
      Message: "L'alimentation de la base de données s'est bien déroulée",
    });
  },
};
