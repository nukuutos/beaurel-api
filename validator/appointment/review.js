const { check } = require('express-validator');
const { paramId, fieldId } = require('../utils/id');

const appointmentId = paramId('appointmentId', 'Appointment Id');
const masterId = paramId('masterId', 'Master Id');

const value = check('value')
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Review value is required.')
  .isInt(1, 5)
  .withMessage('Not correcting review value')
  .customSanitizer((value) => Number(value));

const comment = check('comment')
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Comment value is required.')
  .isString()
  .withMessage('Comment is incorrect');

exports.addReview = [masterId, appointmentId, value, comment];
exports.updateReview = [masterId, appointmentId, value, comment];
