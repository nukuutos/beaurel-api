const { body, paramId } = require('express-validator');

const {
  ABOUT_TEXT_LENGTH,
  INVALID_ABOUT_TEXT,
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
  .matches(/^[а-яa-z -,.!?():;0-9]+$/i)
  .withMessage(INVALID_ABOUT_TEXT)
  .trim()
  .isLength({ min: 0, max: 150 })
  .withMessage(ABOUT_TEXT_LENGTH);

const firstName = body('firstName')
  .optional()
  .trim()
  .isLength({ min: 2, max: 20 })
  .withMessage(INVALID_FIRST_NAME_LENGTH)
  .matches(/^[а-я -]+$/i)
  .withMessage(INVALID_FIRST_NAME);

const lastName = body('lastName')
  .optional()
  .trim()
  .isLength({ min: 2, max: 20 })
  .withMessage(INVALID_LAST_NAME_LENGTH)
  .matches(/^[а-я -]+$/i)
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

exports.updateAvatar = [profileId];
exports.updateProfile = [profileId, updateFields, aboutText, firstName, lastName];
exports.updateUsername = [profileId, username];
