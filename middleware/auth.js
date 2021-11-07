const jwt = require("jsonwebtoken");
const { NO_TOKEN, UNAUTHORIZED } = require("../config/errors/auth");

const HttpError = require("../models/utils/http-error");

const { JWT_KEY_ACCESS } = process.env;

const getToken = (headers) => {
  const { authorization } = headers;

  if (authorization && authorization.startsWith("Bearer")) {
    return authorization.split(" ")[1];
  }

  return null;
};

module.exports = (req, res, next) => {
  const token = getToken(req.headers);

  if (!token) throw new HttpError(NO_TOKEN, 401);

  try {
    const { user } = jwt.verify(token, JWT_KEY_ACCESS);
    req.setUser(user);
  } catch (error) {
    throw new HttpError(UNAUTHORIZED, 401);
  }

  next();
};
