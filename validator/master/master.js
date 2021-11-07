const { paramId, query } = require('express-validator');
const {
  INVALID_PAGE,
  INVALID_SPECIALIZATION,
  NO_SPECIALIZATION,
  NO_NAME,
  NO_PAGE,
} = require('../../config/errors/master');
const { MASTER_ID } = require('../../config/id-names');
const specializations = require('../../config/specializations');

const masterId = paramId('masterId', MASTER_ID);

const specialization = query('specialization')
  .exists({ checkNull: true })
  .withMessage(NO_SPECIALIZATION)
  .bail()
  .trim()
  .custom((value) => specializations.includes(value))
  .withMessage(INVALID_SPECIALIZATION);

const name = query('name')
  .exists({ checkNull: true })
  .withMessage(NO_NAME)
  .bail()
  .trim()
  .customSanitizer((string) => string.replace(/[^а-яА-Я]/g, ''));

const page = query('page')
  .exists({ checkNull: true })
  .withMessage(NO_PAGE)
  .isInt({ min: 0 })
  .withMessage(INVALID_PAGE)
  .customSanitizer((value) => +value);

exports.getMastersByQuery = [name, specialization, page];
exports.getMasterTimezone = [masterId];
