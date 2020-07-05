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
  parseAuthorization: (authorization) => {
    return authorization !== null ? authorization.replace('Bearer ', '') : null;
  },
  getUserId: (authorization, res) => {
    let userId = -1;
    const token = module.exports.parseAuthorization(authorization);
    if (token) {
      try {
        const jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if (!jwtToken) {
          return res.status(401).json({
            error: 'Token null lors de la verification! ❌',
          });
        }
        console.log(jwtToken);
        userId = jwtToken.userId;
      } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({
            error: 'Token invalide lors de la verification! ❌',
          });
        }
      }
    }
    return userId;
  },
};
