const isEqual = require('lodash.isequal');

const Review = require('../models/review');
const HttpError = require('../models/http-error');

const asyncHandler = require('../middleware/async-handler');

// change from review to review

exports.getReviews = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;

  const reviews = await Review.find(masterId);
  return res.json({ reviews });
});

// exports.addReview = asyncHandler(async (req, res, next) => {
//   const { masterId, value, comment } = req.body;
//   const customerId = req.user.id;

//   let review = await Review.findOne({ masterId, customerId }, { _id: 1 });

//   if (review) return next(new HttpError('Review has already existed'), 400);

//   if (isEqual(customerId, masterId)) return next(new HttpError('You can not add review to yourself'), 400);

//   review = new Review(masterId, customerId, value, comment);

//   await review.save();
//   return res.json({ message: 'Review is saved' });
// });

// exports.updateReview = asyncHandler(async (req, res, next) => {
//   const { reviewId } = req.params;
//   const { value, comment } = req.body;
//   const customerId = req.user.id;

//   // const date = new Date();
//   // date.setUTCHours(0, 0, 0, 0);

//   await Review.updateOne({ _id: reviewId, customerId }, { value, comment });
//   return res.json({ message: 'Review is updated' });
// });

// exports.deleteReview = asyncHandler(async (req, res, next) => {
//   const { reviewId } = req.params;
//   const customerId = req.user.id;

//   await Review.deleteOne({ _id: reviewId, customerId });
//   return res.json({ message: 'Review is deleted' });
// });

// exports.upsertReply = asyncHandler(async (req, res, next) => {
//   const { reviewId } = req.params;
//   const { reply } = req.body;
//   const masterId = req.user.id;

//   await Review.updateOne({ _id: reviewId, masterId }, { reply });
//   return res.json({ message: 'Reply is saved' });
// });

// exports.deleteReply = asyncHandler(async (req, res, next) => {
//   const { reviewId } = req.params;
//   const masterId = req.user.id;

//   await Review.updateOne({ _id: reviewId, masterId }, { reply: null });
//   return res.json({ message: 'Reply is deleted' });
// });
