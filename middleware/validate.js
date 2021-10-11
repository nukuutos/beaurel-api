const { validationResult } = require("express-validator");

const HttpError = require("../models/utils/http-error");

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  const isErrors = !errors.isEmpty();

  if (isErrors) {
    const errorsArray = errors.array();
    const { msg: firstMessage } = errorsArray[0];
    throw new HttpError(firstMessage, 400);
  }

  next();
};
