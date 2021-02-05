const { check } = require('express-validator');
const { paramId, fieldId } = require('./utils/id');

const reviewId = paramId('reviewId', 'Review Id');
const masterId = fieldId('masterId', 'Master Id');

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

const reply = check('reply')
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Comment value is required.')
  .isString()
  .withMessage('Comment is incorrect');

exports.addReview = [masterId, value, comment];
exports.updateReview = [reviewId, masterId, value, comment];
exports.upsertReply = [reviewId, reply];
exports.reviewId = [reviewId];
exports.getReviews = [masterId];
