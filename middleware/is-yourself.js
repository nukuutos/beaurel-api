const { UNAUTHORIZED } = require("../config/errors/auth");
const HttpError = require("../models/utils/http-error");

const getParamId = (params) => {
  const { masterId, profileId } = params;

  return masterId || profileId;
};

module.exports = (req, res, next) => {
  const { params, user } = req;

  const paramId = getParamId(params);

  const isYourself = paramId.toString() === user.id.toString();

  if (!isYourself) throw new HttpError(UNAUTHORIZED, 401);

  next();
};
