const models = require('../models');

module.exports = {
  addPlace: async (req, res) => {
    const newPlace = await models.Place.create({
      title: req.body.title,
      description: req.body.description,
      rooms: req.body.rooms,
      bathrooms: req.body.bathrooms,
      max_guests: req.body.max_guests,
      price_by_night: req.body.price_by_night,
      city_id: req.body.city_id,
      host_id: req.body.host_id,
    });

    res.status(201).json({
      city: newPlace.city_id,
      title: newPlace.title,
      description: newPlace.description,
      rooms: newPlace.rooms,
      bathrooms: newPlace.bathrooms,
      max_guests: newPlace.max_guests,
      price_by_night: newPlace.price_by_night,
    });
  },
};
