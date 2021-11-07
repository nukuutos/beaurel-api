const { NO_IMAGE } = require('../config/errors/image');
const HttpError = require('../models/utils/http-error');

module.exports = (req, res, next) => {
  if (!req.file) throw new HttpError(NO_IMAGE, 400);
  next();
};
