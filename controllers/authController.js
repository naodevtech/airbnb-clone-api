const brcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

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
    if (
      user.lastname == null ||
      user.firstname == null ||
      user.email == null ||
      user.password == null ||
      user.role == null ||
      user.avatar == null
    ) {
      return res.status(400).json({
        error: 'missing parameters',
      });
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
