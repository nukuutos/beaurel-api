const res = require('express/lib/response');

const { createAccessToken, createRefreshToken } = require('./create-token');

const { JWT_KEY_REFRESH_TIME, NODE_ENV } = process.env;

res.sendToken = function (user) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const { _id, role, username } = user;

  const options = {
    httpOnly: true,
    secure: NODE_ENV !== 'development',
    maxAge: JWT_KEY_REFRESH_TIME, // 7 days env
    path: '/',
    sameSite: true,
  };

  return this.cookie('refreshToken', refreshToken, options).json({
    accessToken,
    username,
    role,
    id: _id,
  });
};
