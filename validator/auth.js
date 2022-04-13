const { body, cookie, oneOf, paramId } = require('express-validator');
const { ObjectId } = require('mongodb');
const cities = require('../config/cities');

const {
  NO_REFRESH_TOKEN,
  PASSWORD_REQUIRED,
  MIN_PASSWORD_LENGTH,
  PASSWORDS_DISMATCHED,
  ALPHABATIC_FIRST_NAME,
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  ALPHABATIC_LAST_NAME,
  MIN_LAST_NAME_LENGTH,
  MIN_FIRST_NAME_LENGTH,
  PHONE_NUMBER_REQUIRED,
  INVALID_PHONE_NUMBER,
  INVALID_IDENTIFICATOR_OR_PASSWORD,
  INVALID_VERIFICATION_CODE,
  INVALID_ROOM_VALUE,
  INVALID_ROOM_TYPE,
  MAX_BUILDING_LENGTH,
  INVALID_FLOOR,
  NO_FLOOR,
  INVALID_HOUSE,
  NO_HOUSE,
  INVALID_STREET_LENGTH,
  NO_STREET,
  NO_PLACE_OF_WORK,
  NO_CITY,
  INVALID_CITY,
} = require('../config/errors/auth');

const { NO_SPECIALIZATION, INVALID_SPECIALIZATION } = require('../config/errors/master');

const specializations = require('../config/specializations');

const phoneSignIn = body('identificator')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(PHONE_NUMBER_REQUIRED)
  .isMobilePhone('ru-RU')
  .withMessage(INVALID_PHONE_NUMBER)
  .customSanitizer((value) => {
    if (value[0] === '8') {
      value = value.split('');
      value[0] = '+7';
      value = value.join('');
    }
    return { phone: value };
  });

const id = body('identificator')
  .trim()
  .exists({ checkFalsy: true })
  .isMongoId()
  .bail()
  .customSanitizer((value) => ({ $or: [{ _id: new ObjectId(value) }, { username: value }] }));

const username = body('identificator')
  .trim()
  .exists({ checkFalsy: true })
  .isLength({ min: 3, max: 20 })
  .matches(/^[a-z_.\d]+$/i)
  // at least one alphabetic symbol
  .matches(/[a-z]/i)
  .not()
  .isIn(['profile', 'appointments', 'services', 'search', 'timetable', 'masters', 'settings'])
  .bail()
  .customSanitizer((value) => ({ username: value }));

const identificator = oneOf([phoneSignIn, id, username], INVALID_IDENTIFICATOR_OR_PASSWORD);

const phoneSignUp = body('phone')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(PHONE_NUMBER_REQUIRED)
  .isMobilePhone('ru-RU', { strictMode: true })
  .withMessage(INVALID_PHONE_NUMBER);

const specialization = body('specialization')
  .optional()
  .exists({ checkFalsy: true })
  .withMessage(NO_SPECIALIZATION)
  .bail()
  .trim()
  .custom((value) => {
    const [whitespace, ...restSpecializations] = specializations;
    return restSpecializations.includes(value);
  })
  .withMessage(INVALID_SPECIALIZATION);

const passwordSignUp = body('password')
  .exists({ checkFalsy: true })
  .withMessage(PASSWORD_REQUIRED)
  .isLength({ min: 6 })
  .withMessage(MIN_PASSWORD_LENGTH)
  .custom((password, { req }) => {
    const { confirmedPassword } = req.body;
    return password === confirmedPassword;
  })
  .withMessage(PASSWORDS_DISMATCHED);

const passwordSignIn = body('password').exists({ checkFalsy: true }).withMessage(PASSWORD_REQUIRED);

const firstName = body('firstName')
  .exists({ checkFalsy: true })
  .withMessage(FIRST_NAME_REQUIRED)
  .trim()
  .isLength({ min: 2 })
  .withMessage(MIN_FIRST_NAME_LENGTH)
  .isAlpha('ru-RU')
  .withMessage(ALPHABATIC_FIRST_NAME);

const lastName = body('lastName')
  .exists({ checkFalsy: true })
  .withMessage(LAST_NAME_REQUIRED)
  .trim()
  .isLength({ min: 2 })
  .withMessage(MIN_LAST_NAME_LENGTH)
  .isAlpha('ru-RU')
  .withMessage(ALPHABATIC_LAST_NAME);

const code = body('code')
  .exists({ checkFalsy: true })
  .withMessage(INVALID_VERIFICATION_CODE)
  .trim()
  .isLength({ min: 4, max: 4 })
  .withMessage(INVALID_VERIFICATION_CODE)
  .isAlphanumeric('en-US')
  .withMessage(INVALID_VERIFICATION_CODE);

const refreshToken = cookie('refreshToken')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(NO_REFRESH_TOKEN);

const placeOfWork = body('placeOfWork')
  .custom((value, { req }) => {
    const { specialization } = req.body;
    if (specialization && !value) return false;
    return true;
  })
  .withMessage(NO_PLACE_OF_WORK);

const street = body('placeOfWork.street')
  .if(body('placeOfWork').exists())
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(NO_STREET)
  .isLength({ min: 2, max: 148 })
  .withMessage(INVALID_STREET_LENGTH);

const house = body('placeOfWork.house')
  .if(body('placeOfWork').exists())
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(NO_HOUSE)
  .isLength({ min: 1, max: 8 })
  // .matches(/[1-9][0-9]*([а-яё]|(\/[1-9][0-9]*))?/gi)
  .withMessage(INVALID_HOUSE);

const floor = body('placeOfWork.floor')
  .if(body('placeOfWork').exists())
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(NO_FLOOR)
  .isInt({ min: 1, max: 87 })
  .withMessage(INVALID_FLOOR);

const building = body('placeOfWork.building')
  .trim()
  .optional({ checkFalsy: true })
  .isLength({ min: 1, max: 6 })
  .withMessage(MAX_BUILDING_LENGTH);

const roomType = body('placeOfWork.room.type')
  .if(body('placeOfWork').exists())
  .isIn(['salon', 'apartment', 'cabinet'])
  .withMessage(INVALID_ROOM_TYPE);

const roomValue = body('placeOfWork.room.value')
  .if(body('placeOfWork').exists())
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(INVALID_ROOM_VALUE)
  .isLength({ min: 1, max: 32 })
  .withMessage(INVALID_ROOM_VALUE);

const city = body('city')
  .exists({ checkFalsy: true })
  .withMessage(NO_CITY)
  .isIn(cities)
  .withMessage(INVALID_CITY);

const newPassword = body('newPassword')
  .exists({ checkFalsy: true })
  .withMessage(PASSWORD_REQUIRED)
  .isLength({ min: 6 })
  .withMessage(MIN_PASSWORD_LENGTH)
  .custom((newPassword, { req }) => {
    const { newConfirmedPassword } = req.body;
    return newPassword === newConfirmedPassword;
  })
  .withMessage(PASSWORDS_DISMATCHED);

exports.signUp = [
  phoneSignUp,
  passwordSignUp,
  firstName,
  lastName,
  specialization,
  city,
  placeOfWork,
  street,
  house,
  building,
  floor,
  roomType,
  roomValue,
];

exports.confirmAccount = [phoneSignUp, code];
exports.updatePassword = [phoneSignUp, code, newPassword];
exports.resendVerificationCode = [phoneSignUp];
exports.sendVerificationCode = [phoneSignUp];
exports.signIn = [identificator, passwordSignIn];
exports.refreshToken = [refreshToken];
