// Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');

// Routes
module.exports = {
  register: function (req, res) {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const avatar = req.body.avatar;

    if (
      firstName == null ||
      lastName == null ||
      email == null ||
      password == null ||
      role == null ||
      avatar == null
    ) {
      return res.status(400).json({ error: 'missing parameters' });
    }

    models.User.findOne({
      attributes: ['email'],
      where: { email: email },
    })
      .then(function (userFound) {
        if (!userFound) {
          bcrypt.hash(password, 5, function (err, bcryptedpassword) {
            const newUser = models.User.create({
              firstname: firstName,
              lastname: lastName,
              email: email,
              password: bcryptedpassword,
              role: role,
              avatar: avatar,
            })
              .then(function (newUser) {
                return res.status(201).json({
                  id: newUser.id,
                });
              })
              .catch(function (error) {
                return res.status(500).json({ error: 'cannot add user' });
              });
          });
        } else {
          return res.status(400).json({ error: 'user already exists' });
        }
      })
      .catch(function (error) {
        return res.status(500).json({ error: 'unable to verify user ' });
      });
  },
  login: function (req, res) {},
};
