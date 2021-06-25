const { check } = require('express-validator');
const { paramId } = require('../../utils/id');

const appointmentId = paramId('appointmentId', 'Appointment Id');
const masterId = paramId('masterId', 'Master Id');

const value = check('value')
  .exists({ checkFalsy: true })
  .withMessage('Review value is required.')
  .isInt({ min: 1, max: 5 })
  .withMessage('Not correcting review value')
  .customSanitizer((value) => Number(value));

const comment = check('comment')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Comment value is required.')
  .isString()
  .withMessage('Comment is incorrect')
  .isLength({ min: 3, max: 500 })
  .withMessage('Lenght of comment must be between 3 and 500 characters');

exports.addReview = [masterId, appointmentId, value, comment];
exports.updateReview = [masterId, appointmentId, value, comment];
