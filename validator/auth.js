const { body, cookie, oneOf } = require('express-validator');
const { ObjectId } = require('mongodb');

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
  .matches(/^[a-z_.]+$/i)
  // at least one alphabetic symbol
  .matches(/[a-z]/i)
  .not()
  .isIn(['profile', 'appointments', 'services', 'search', 'timetable', 'masters', 'settings'])
  .bail()
  .customSanitizer((value) => ({ username: value }));

const email = body('identificator')
  .trim()
  .exists({ checkFalsy: true })
  .isEmail()
  .bail()
  .normalizeEmail()
  .customSanitizer((value) => ({ email: value }));

const identificator = oneOf([phoneSignIn, id, username, email], INVALID_IDENTIFICATOR_OR_PASSWORD);

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

exports.signUp = [phoneSignUp, passwordSignUp, firstName, lastName, specialization];
exports.confirmAccount = [phoneSignUp, code];
exports.resendVerificationCode = [phoneSignUp];
exports.signIn = [identificator, passwordSignIn];
exports.refreshToken = [refreshToken];
