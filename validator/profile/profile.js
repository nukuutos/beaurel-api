const { body, paramId } = require('express-validator');

const {
  ABOUT_TEXT_LENGTH,
  INVALID_FIRST_NAME_LENGTH,
  INVALID_FIRST_NAME,
  INVALID_LAST_NAME_LENGTH,
  INVALID_LAST_NAME,
  USERNAME_REQUIRED,
  USERNAME_LENGTH,
  INVALID_USERNAME,
} = require('../../config/errors/profile');

const { PROFILE_ID } = require('../../config/id-names');

const profileId = paramId('profileId', PROFILE_ID);

const updateFields = body('*').expectedFields(['aboutText', 'firstName', 'lastName']);

const aboutText = body('aboutText')
  .optional()
  .trim()
  .isLength({ min: 0, max: 150 })
  .withMessage(ABOUT_TEXT_LENGTH);

const firstName = body('firstName')
  .optional()
  .trim()
  .isLength({ min: 2, max: 20 })
  .withMessage(INVALID_FIRST_NAME_LENGTH)
  .matches(/^[ёа-я-]+$/i)
  .withMessage(INVALID_FIRST_NAME);

const lastName = body('lastName')
  .optional()
  .trim()
  .isLength({ min: 2, max: 20 })
  .withMessage(INVALID_LAST_NAME_LENGTH)
  .matches(/^[ёа-я-]+$/i)
  .withMessage(INVALID_LAST_NAME);

const username = body('username')
  .exists({ checkFalsy: true })
  .withMessage(USERNAME_REQUIRED)
  .trim()
  .isLength({ min: 3, max: 20 })
  .withMessage(USERNAME_LENGTH)
  .matches(/^[a-z_.]+$/i)
  .withMessage(INVALID_USERNAME)
  // at least one alphabetic symbol
  .matches(/[a-z]/i)
  .withMessage(INVALID_USERNAME)
  .not()
  .isIn(['profile', 'appointments', 'services', 'search', 'timetable', 'masters', 'settings'])
  .withMessage(INVALID_USERNAME);


const newPasswordUpdate = body('newPassword')
  .exists({ checkFalsy: true })
  .withMessage(PASSWORD_REQUIRED)
  .isLength({ min: 6 })
  .withMessage(MIN_PASSWORD_LENGTH)
  .custom((newPassword, { req }) => {
    const { newConfirmedPassword } = req.body;
    return newPassword === newConfirmedPassword;
  })
  .withMessage(PASSWORDS_DISMATCHED);

const passwordUpdate = body('password').exists({ checkFalsy: true }).withMessage(PASSWORD_REQUIRED);

exports.updateAvatar = [profileId];
exports.getCustomerProfile = [profileId];
exports.getOnlineStatus = [profileId];
exports.updateOnlineStatus = [profileId];
exports.updateProfile = [profileId, updateFields, aboutText, firstName, lastName];
exports.updateUsername = [profileId, username];
exports.updatePassword = [profileId, newPasswordUpdate, passwordUpdate];
