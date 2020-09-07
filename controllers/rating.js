const isEqual = require('lodash.isequal');

const Rating = require('../models/rating');
const HttpError = require('../models/http-error');

const asyncHandler = require('../middleware/async-handler');

exports.addRating = asyncHandler(async (req, res, next) => {
  const { masterId, value, comment } = req.body;
  const customerId = req.user.id;

  let rating = await Rating.findOne({ masterId, customerId }, { _id: 1 });

  if (rating) return next(new HttpError('Rating has already existed'), 400);

  if (isEqual(customerId, masterId)) return next(new HttpError('You can not add rating to yourself'), 400);

  rating = new Rating(masterId, customerId, value, comment);

  await rating.save();
  return res.json({ message: 'Rating is saved' });
});

exports.updateRating = asyncHandler(async (req, res, next) => {
  const { ratingId } = req.params;
  const { value, comment } = req.body;
  const customerId = req.user.id;

  // const date = new Date();
  // date.setUTCHours(0, 0, 0, 0);

  await Rating.updateOne({ _id: ratingId, customerId }, { value, comment });
  return res.json({ message: 'Rating is updated' });
});

exports.deleteRating = asyncHandler(async (req, res, next) => {
  const { ratingId } = req.params;
  const customerId = req.user.id;

  await Rating.deleteOne({ _id: ratingId, customerId });
  return res.json({ message: 'Rating is deleted' });
});

exports.upsertReply = asyncHandler(async (req, res, next) => {
  const { ratingId } = req.params;
  const { reply } = req.body;
  const masterId = req.user.id;

  await Rating.updateOne({ _id: ratingId, masterId }, { reply });
  return res.json({ message: 'Reply is saved' });
});

exports.deleteReply = asyncHandler(async (req, res, next) => {
  const { ratingId } = req.params;
  const masterId = req.user.id;

  await Rating.updateOne({ _id: ratingId, masterId }, { reply: null });
  return res.json({ message: 'Reply is deleted' });
});
