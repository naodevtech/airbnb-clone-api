const brcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils');
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
    const checkEmail = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
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
    if (!checkEmail.test(user.email)) {
      return res.status(400).json({
        error: `Le champ email est mal renseigné ex:hello@contact.com ❌`,
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
  login: (req, res) => {
    const userinfos = {
      email: req.body.email,
      password: req.body.password,
    };
    if (userinfos.email == null || userinfos.password == null) {
      return res.status(400).json({
        error: `L'email ou le mot de passe n'est pas renseigné ❌`,
      });
    }
    models.User.findOne({
      where: { email: userinfos.email },
    })
      .then((userFound) => {
        if (userFound) {
          brcrypt.compare(
            userinfos.password,
            userFound.password,
            (errBycrypt, resBycrypt) => {
              const userToken = {
                role: userFound.role,
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                email: userFound.email,
              };
              if (resBycrypt) {
                return res.status(200).json({
                  token: jwtUtils.genereateTokenForUser(userFound),
                  user: userToken,
                });
              }
              return res.status(403).json({
                error: 'Mot de passe incorrect ! ❌',
              });
            }
          );
        } else {
          return res.status(404).json({
            error: "L'utilisateur demandé n'existe pas ❌",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: "Vérification de l'existance de l'utilisateur impossible ❌",
        });
      });
  },
};
