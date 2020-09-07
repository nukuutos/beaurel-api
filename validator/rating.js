const { check } = require('express-validator');
const { paramId, fieldId } = require('./utils/id');

const ratingId = paramId('ratingId', 'Rating Id');
const masterId = fieldId('masterId', 'Master Id');

const value = check('value')
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Rating value is required.')
  .isInt(1, 5)
  .withMessage('Not correcting rating value')
  .customSanitizer((value) => Number(value));

const comment = check('comment')
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Comment value is required.')
  .isString()
  .withMessage('Comment is incorrect');

const reply = check('reply')
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Comment value is required.')
  .isString()
  .withMessage('Comment is incorrect');

exports.addRating = [masterId, value, comment];
exports.updateRating = [ratingId, masterId, value, comment];
exports.upsertReply = [ratingId, reply];
exports.ratingId = [ratingId];
