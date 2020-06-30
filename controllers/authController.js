const brcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  register: (req, res) => {
    console.log('register');
    res.status(200).json({
      message: 'okk',
    });
  },
};
