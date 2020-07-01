const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'secret';
module.exports = {
  genereateTokenForUser: (userData) => {
    return jwt.sign(
      {
        userId: userData.id,
        role: userData.role,
      },
      JWT_SIGN_SECRET,
      {
        expiresIn: '1h',
      }
    );
  },
};
