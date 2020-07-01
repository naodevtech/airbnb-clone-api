const brcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

module.exports = {
  register: (req, res) => {
    const user = {
      lastname: req.body.lastname,
      firstname: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      avatar: req.body.avatar,
    };
    for (const key in user) {
      if (user[key] == null) {
        return res.status(400).json({
          error: `Le champs ${key} n'est pas renseigné ❌`,
        });
      }
    }
    for (const key in user) {
      if (!isString(user[key])) {
        return res.status(400).json({
          error: `Le champs ${key} n'est pas une chaîne de caractères ❌`,
        });
      }
    }
    // TODO : check forms
    models.User.findOne({
      attributes: ['email'],
      where: { email: user.email },
    })
      .then((userFound) => {
        if (!userFound) {
          brcrypt.hash(user.password, 5, (err, bcryptedPassword) => {
            const newUser = models.User.create({
              email: user.email,
              lastname: user.lastname,
              firstname: user.firstname,
              email: user.email,
              password: bcryptedPassword,
              role: user.role,
              avatar: user.avatar,
            })
              .then((newUser) => {
                return res.status(201).json({
                  role: newUser.role,
                  firstname: newUser.firstname,
                  lastname: newUser.lastname,
                  email: newUser.email,
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  error: "Impossible d'ajouter un utilisateur ❌",
                });
              });
          });
        } else {
          return res.status(409).json({
            error: 'Un utilisateur existe déjà sous le même email ❌',
          });
        }
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ error: "Quelque chose c'est mal passé ❌" });
      });
  },
};
