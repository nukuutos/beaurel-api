const { query } = require("express-validator");

const {
  LATITUDE_REQUIRED,
  LONGITUDE_REQUIRED,
  INVALID_CITY,
  INVALID_PAGE,
} = require("../config/errors/timezone");

const lat = query("lat")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(LATITUDE_REQUIRED)
  .customSanitizer((value) => +value);

const lng = query("lng")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(LONGITUDE_REQUIRED)
  .customSanitizer((value) => +value);

const city = query("city")
  .trim()
  .exists({ checkNull: true })
  .withMessage(INVALID_CITY)
  .customSanitizer((string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

const page = query("page")
  .isNumeric({ no_symbols: true })
  .withMessage(INVALID_PAGE)
  .customSanitizer((value) => +value);

exports.getTimezone = [lat, lng];
exports.getTimezoneByQuery = [city, page];
