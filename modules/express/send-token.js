const res = require("express/lib/response");
const { sign } = require("jsonwebtoken");

const {
  JWT_KEY_ACCESS,
  JWT_KEY_ACCESS_TIME,
  JWT_KEY_REFRESH,
  JWT_KEY_REFRESH_TIME,
  NODE_ENV,
} = process.env;

const createAccessToken = (user) => {
  const { _id, role } = user;

  const payload = {
    user: {
      id: _id,
      role,
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

res.sendToken = function (user) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const { _id, role } = user;

  const options = {
    httpOnly: true,
    secure: NODE_ENV !== "development",
    maxAge: JWT_KEY_REFRESH_TIME, // 7 days env
    path: "/",
    sameSite: true,
  };

  return this.cookie("refreshToken", refreshToken, options).json({ accessToken, role, id: _id });
};
