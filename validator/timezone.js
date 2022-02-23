const { query } = require('express-validator');

const {
  LATITUDE_REQUIRED,
  LONGITUDE_REQUIRED,
  INVALID_CITY,
  INVALID_PAGE,
  INVALID_LATITUDE,
  INVALID_LONGITUDE,
} = require('../config/errors/timezone');

const lat = query('lat')
  .exists({ checkFalsy: true })
  .withMessage(LATITUDE_REQUIRED)
  .isNumeric()
  .withMessage(INVALID_LATITUDE)
  .customSanitizer((value) => +value);

const lng = query('lng')
  .exists({ checkFalsy: true })
  .withMessage(LONGITUDE_REQUIRED)
  .isNumeric()
  .withMessage(INVALID_LONGITUDE)
  .customSanitizer((value) => +value);

const city = query('city')
  .exists({ checkNull: true })
  .withMessage(INVALID_CITY)
  .bail()
  .customSanitizer((string) => string.replace(/[^ёа-яА-Я]/g, ''));

const page = query('page')
  .exists({ checkNull: true })
  .withMessage(INVALID_PAGE)
  .isInt({ min: 0 })
  .withMessage(INVALID_PAGE)
  .customSanitizer((value) => +value);

exports.getTimezone = [lat, lng];
exports.getTimezoneByQuery = [city, page];
