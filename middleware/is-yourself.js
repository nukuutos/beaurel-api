const { UNAUTHORIZED } = require("../config/errors/auth");
const HttpError = require("../models/utils/http-error");

const getParamIds = (params) => {
  const paramIds = Object.values(params);

  return paramIds.map((id) => {
    const isMongoId = typeof id === "object";
    return isMongoId ? id.toString() : id;
  });
};

module.exports = (req, res, next) => {
  const { params, user } = req;

  const paramIds = getParamIds(params);

  const isYourself = paramIds.includes(user.id.toString());

  if (!isYourself) throw new HttpError(UNAUTHORIZED, 401);

  next();
};
