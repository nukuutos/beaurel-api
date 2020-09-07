const { sign } = require('jsonwebtoken');

const createAccessToken = (user) => {
  const { _id, role } = user;

  const payload = {
    user: {
      id: _id,
      role,
    },
  };

  return sign(payload, process.env.JWT_KEY_ACCESS, { expiresIn: process.env.JWT_KEY_ACCESS_TIME });
};

const createRefreshToken = (user) => {
  const { _id } = user;

  const payload = {
    user: {
      id: _id,
    },
  };

  return sign(payload, process.env.JWT_KEY_REFRESH, { expiresIn: process.env.JWT_KEY_REFRESH_TIME });
};

exports.sendTokenResponse = (user, res) => {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const { role } = user;

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: process.env.JWT_KEY_REFRESH_TIME, // 7 days env
    path: '/',
    sameSite: true,
  };

  return res.cookie('refreshToken', refreshToken, options).json({ accessToken, role });
};
