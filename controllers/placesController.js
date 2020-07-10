const models = require('../models');
const authController = require('./authController');

module.exports = {
  addPlace: (req, res, userSession) => {
    console.log(userSession);
    const place = {
      title: req.body.title,
      description: req.body.description,
      rooms: req.body.rooms,
      bathrooms: req.body.bathrooms,
      max_guests: req.body.max_guests,
      price_by_night: req.body.price_by_night,
      image: req.body.image,
      city_id: req.body.city_id,
      host_id: userSession.id,
    };
    for (const key in place) {
      if (place[key] == null) {
        return res.status(400).json({
          error: `Le champs ${key} n'est pas renseigné ❌`,
        });
      }
    }
    models.Place.findOne({
      attributes: ['title'],
      where: { title: place.title },
    })
      .then((placeFounded) => {
        if (!placeFounded) {
          console.log(placeFounded);
          const newPlace = models.Place.create({
            title: req.body.title,
            description: req.body.description,
            rooms: req.body.rooms,
            bathrooms: req.body.bathrooms,
            max_guests: req.body.max_guests,
            price_by_night: req.body.price_by_night,
            image: req.body.image,
            city_id: req.body.city_id,
            host_id: userSession.id,
          }).then((newPlace) => {
            models.City.findOne({
              where: { id: req.body.city_id },
            })
              .then((cityFounded) => {
                return res
                  .status(201)
                  .json({
                    id: newPlace.id,
                    city: cityFounded.name,
                    title: newPlace.title,
                    description: newPlace.description,
                    rooms: newPlace.rooms,
                    bathrooms: newPlace.bathrooms,
                    max_guests: newPlace.max_guests,
                    price_by_night: newPlace.price_by_night,
                    image: newPlace.image,
                  })
                  .catch((err) => {
                    res.status(400).json({
                      error: 'Aucune ville retrouvé à cet id ❌',
                    });
                  });
              })
              .catch((err) => {
                return res.status(401).json({
                  error: "Impossible d'ajouter un(e) appartement/maison ❌",
                });
              });
          });
        } else {
          return res.status(400).json({
            error:
              "Un appartement existe déjà avec un titre d'annonce similaire ❌",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          error:
            "Il semble y avoir une erreur lors de la création de l'annonce ❌",
        });
      });
  },
  getPlaceById: (req, res) => {
    models.Place.findOne({
      attributes: [
        'id',
        'title',
        'description',
        'rooms',
        'bathrooms',
        'max_guests',
        'price_by_night',
        'image',
        'city_id',
      ],
      where: { id: req.params.id },
    })
      .then((placeFounded) => {
        models.City.findOne({
          where: { id: placeFounded.city_id },
        })
          .then((cityFounded) => {
            console.log(placeFounded);
            if (placeFounded && cityFounded) {
              return res.status(200).json({
                id: placeFounded.id,
                city: cityFounded.name,
                title: placeFounded.title,
                description: placeFounded.description,
                rooms: placeFounded.rooms,
                bathrooms: placeFounded.bathrooms,
                max_guests: placeFounded.max_guests,
                price_by_night: placeFounded.price_by_night,
                image: placeFounded.image,
              });
            }
            res.status(404).json({
              error: "Aucun appartement n'as été trouvé avec cet id ❌",
            });
          })
          .catch((err) => {
            return res.status(404).json({
              error:
                "Il semble qu'il y est une erreur dans la récupération de la ville",
            });
          });
      })
      .catch((err) => {
        res.status(400).json({
          error:
            "Il y'a eu une erreur lors de la recherche de l'appartement via l'id ❌",
        });
      });
  },
  getAllPlaces: (req, res) => {
    models.Place.findAll({
      attributes: [
        'id',
        'city_id',
        'title',
        'description',
        'rooms',
        'bathrooms',
        'max_guests',
        'price_by_night',
        'image',
      ],
      include: [
        {
          model: models.City,
          attributes: ['name'],
        },
      ],
      // raw: true,
    })
      .then((places) => {
        console.log(places[0].City);
        res.status(201).json(places);
      })
      .catch((err) => {
        return res.status(404).json({
          error:
            "Il semble qu'il y est une erreur dans la récupération de tous les appartements ❌",
        });
      });
  },
  getPlacesByCity: (req, res) => {
    console.log(req.query.cityName);
    models.City.findAll({
      atttributes: ['id', 'name'],
      where: { name: req.query.cityName },
    }).then((city) => {
      // console.log(city);
      models.Place.findAll({
        attributes: [
          'id',
          'title',
          'city_id',
          'description',
          'rooms',
          'bathrooms',
          'max_guests',
          'price_by_night',
        ],
        include: [
          {
            model: models.City,
            attributes: ['name'],
          },
        ],
        where: { city_id: city[0].dataValues.id },
      })
        .then((places) => {
          if (places.length > 0) {
            res.status(201).json(places);
          }
          res.status(400).json({
            error:
              "Il ne semble pas y avoir d'appartements en location dans cette ville ❌",
          });
        })
        .catch((err) => {
          return res.status(404).json({
            error:
              "Il semble qu'il y est une erreur dans la récupération des appartements via le nom de la ville ❌",
          });
        });
    });
  },
  deletePlace: (req, res, userSession) => {
    models.Place.destroy({
      where: {
        id: req.params.id,
        host_id: userSession.id,
      },
    })
      .then((placeDeleted) => {
        if (placeDeleted === 1) {
          return res.status(204);
        }
        return res.status(403).json({
          message:
            "Vous n'êtes pas autorisé à supprimer un bien ne vous appartenant pas ❌",
        });
      })
      .catch((err) => {
        return res.status(403).json({
          error:
            "Il y'a eu une erreur lors de la suppresion d'un de vos biens ❌",
        });
      });
  },
  updatePlaceValues: async (req, res, userSession) => {
    console.log(req.body);
    const place = await models.Place.findOne({
      attributes: [
        'id',
        'title',
        'description',
        'rooms',
        'bathrooms',
        'max_guests',
        'price_by_night',
      ],
      include: [
        {
          model: models.City,
          attributes: ['name'],
        },
      ],
      where: { id: req.params.placeId, host_id: userSession.id },
    });
    const titleOfPlace = req.body.title;
    const descriptionOfPlace = req.body.description;
    const roomsOfPlace = req.body.rooms;
    const bathroomsofPlace = req.body.bathrooms;
    const maxGuests = req.body.max_guests;
    const priceByNight = req.body.price_by_night;
    if (Object.entries(req.body).length === 0) {
      res.status(404).json({
        Message: 'Aucune données à mettre à jours ❌',
      });
    }
    if (place) {
      if (titleOfPlace) {
        place.title = titleOfPlace;
      }
      if (descriptionOfPlace) {
        place.description = descriptionOfPlace;
      }
      if (roomsOfPlace) {
        place.rooms = roomsOfPlace;
      }
      if (bathroomsofPlace) {
        place.bathrooms = bathroomsofPlace;
      }
      if (maxGuests) {
        place.max_guests = maxGuests;
      }
      if (priceByNight) {
        place.price_by_night = priceByNight;
      }
      await place.save();
      return res.status(201).json(place);
    }
    return res.status(403).json({
      Message:
        "Vous n'êtes pas autorisé à modifier une offre qui ne vous appartiens pas ❌",
    });
  },
};
