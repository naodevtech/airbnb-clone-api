const models = require('../../models');

const DATA_CITIES = require('../../cities.json');

module.exports = {
  addCities: (req, res) => {
    for (let i = 0; i < DATA_CITIES.length; i += 1) {
      models.City.findOne({
        where: { id: DATA_CITIES[i].id },
      })
        .then((cityFounded) => {
          console.log('cityfounded : ', cityFounded);
          if (!cityFounded) {
            let newCities = models.City.create({
              id: DATA_CITIES[i].id,
              name: DATA_CITIES[i].name,
            })
              .then((newCities) => {
                console.log(('newCities : ', newCities));
                return res.status(201).json({
                  Message: 'Les Cities ont été mise à jours ! ✅',
                  City: newCities,
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  error: 'Aucune cities à ajouter ❌',
                });
              });
          }
        })
        .catch((err) => {
          return res.status(400).json({
            error: "Il y'a eu une erreur dans la requête ! ❌",
          });
        });
    }
  },
  getAllCities: (req, res) => {
    models.City.findAll().then((cities) => {
      res.status(201).json({
        cities: cities,
      });
    });
  },
};
