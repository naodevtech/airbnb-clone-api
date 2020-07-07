const models = require('../../models');

const DATA_CITIES = require('../../cities.json');

async function createCity(i) {
  return new Promise((resolve, reject) => {
    models.City.findOne({
      where: { id: DATA_CITIES[i].id },
    })
      .then((cityFounded) => {
        if (!cityFounded) {
          models.City.create({
            id: DATA_CITIES[i].id,
            name: DATA_CITIES[i].name,
          })
            .then((newCities) => {
              resolve(newCities);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          resolve(null);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

async function getCities() {
  let cities = [];
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < DATA_CITIES.length; i += 1) {
      //trycatch
      let city = await createCity(i);
      city ? cities.push(city) : null;
      console.log(city);
      console.log(DATA_CITIES[i]);
    }
    resolve(cities);
  });
}

module.exports = {
  addCities: async (req, res) => {
    const cities = await getCities();
    console.log(cities);
    return res.status(200).json({
      cities,
    });
  },

  getAllCities: async (req, res) => {
    models.City.findAll()
      .then((cities) => {})
      .catch((err) => {
        return res.status(400).json({
          error: err,
        });
      });
  },
};
