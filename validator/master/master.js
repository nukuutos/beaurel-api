const { paramId, query, body } = require('express-validator');
const cities = require('../../config/cities');
const {
  NO_STREET,
  INVALID_STREET_LENGTH,
  NO_HOUSE,
  INVALID_HOUSE,
  NO_FLOOR,
  INVALID_FLOOR,
  MAX_BUILDING_LENGTH,
  INVALID_ROOM_TYPE,
  INVALID_ROOM_VALUE,
  NO_CITY,
} = require('../../config/errors/auth');

const {
  INVALID_PAGE,
  INVALID_SPECIALIZATION,
  NO_SPECIALIZATION,
  NO_NAME,
  NO_PAGE,
} = require('../../config/errors/master');

const { INVALID_CITY } = require('../../config/errors/timezone');
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
  .customSanitizer((string) => string.replace(/[^ёа-яА-Я ]/g, ''));

const page = query('page')
  .exists({ checkNull: true })
  .withMessage(NO_PAGE)
  .isInt({ min: 0 })
  .withMessage(INVALID_PAGE)
  .customSanitizer((value) => +value);

const cityQuery = query('city').exists({ checkNull: true }).withMessage(INVALID_CITY);

const cityBody = body('city')
  .exists({ checkFalsy: true })
  .withMessage(NO_CITY)
  .isIn(cities)
  .withMessage(INVALID_CITY);

const street = body('street')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(NO_STREET)
  .isLength({ min: 2, max: 148 })
  .withMessage(INVALID_STREET_LENGTH);

const house = body('house')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(NO_HOUSE)
  .isLength({ min: 1, max: 8 })
  // .matches(/[1-9][0-9]*([а-яё]|(\/[1-9][0-9]*))?/gi)
  .withMessage(INVALID_HOUSE);

const floor = body('floor')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(NO_FLOOR)
  .isInt({ min: 1, max: 87 })
  .withMessage(INVALID_FLOOR);

const building = body('building')
  .trim()
  .optional({ checkFalsy: true })
  .isLength({ min: 1, max: 6 })
  .withMessage(MAX_BUILDING_LENGTH);

const roomType = body('room.type')
  .isIn(['salon', 'apartment', 'cabinet'])
  .withMessage(INVALID_ROOM_TYPE);

const roomValue = body('room.value')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(INVALID_ROOM_VALUE)
  .isLength({ min: 1, max: 32 })
  .withMessage(INVALID_ROOM_VALUE);

exports.getMastersByQuery = [name, specialization, cityQuery, page];
exports.updatePlaceOfWork = [
  masterId,
  cityBody,
  street,
  house,
  building,
  floor,
  roomType,
  roomValue,
];
