const { sign } = require('jsonwebtoken');

const { JWT_KEY_ACCESS, JWT_KEY_ACCESS_TIME, JWT_KEY_REFRESH, JWT_KEY_REFRESH_TIME } = process.env;

const createAccessToken = (user) => {
  const { _id, username, role } = user;

  const payload = {
    user: {
      id: _id,
      role,
      username,
    },
  };

  return sign(payload, JWT_KEY_ACCESS, { expiresIn: JWT_KEY_ACCESS_TIME });
};

const createRefreshToken = (user) => {
  const { _id } = user;

  const payload = {
    user: {
      id: _id,
    },
  };

  return sign(payload, JWT_KEY_REFRESH, {
    expiresIn: JWT_KEY_REFRESH_TIME,
  });
};

module.exports = { createAccessToken, createRefreshToken };
