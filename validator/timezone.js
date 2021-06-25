const { query } = require('express-validator');

const lat = query('lat')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Latitude is required!')
  .customSanitizer((value) => Number(value));

const lng = query('lng')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Longitude is required!')
  .customSanitizer((value) => Number(value));

exports.getTimezone = [lat, lng];
exports.getTimezoneByCity = [];
