const { NO_AUTHORITY } = require("../config/errors/auth");
const HttpError = require("../models/utils/http-error");

module.exports = (req, res, next) => {
  const { user } = req;

  const isMaster = user && user.role === "master";

  if (!isMaster) throw new HttpError(NO_AUTHORITY, 401);

  next();
};
