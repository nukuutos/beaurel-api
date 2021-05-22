const isEqual = require('lodash.isequal');

const Review = require('../../../models/master/appointment/review');
const Appointment = require('../../../models/master/appointment/appointment');
const HttpError = require('../../../models/http-error');

const asyncHandler = require('../../../middleware/async-handler');

// combine add and update review
exports.addReview = asyncHandler(async (req, res, next) => {
  const { appointmentId, masterId } = req.params;
  const { value, comment } = req.body;
  const customerId = req.user.id;

  // aggregate it(look up it)
  // check appointment is ended?
  const isAppointment = await Appointment.findOne({ _id: appointmentId, masterId, customerId }, { _id: 1 });
  const isReview = await Review.findOne({ appointmentId, masterId, customerId }, { _id: 1 });

  // aggregate it(look up it)
  if (!isAppointment) return next(new HttpError('There is no appointment'), 400);
  if (isReview) return next(new HttpError('Review has already existed'), 400);

  if (process.env.NODE_ENV !== 'development' && isEqual(customerId, masterId)) {
    return next(new HttpError('You can not add review to yourself'), 400);
  }

  const review = new Review(masterId, customerId, appointmentId, value, comment);

  await review.save();
  return res.json({ message: 'Review is saved' });
});

exports.updateReview = asyncHandler(async (req, res, next) => {
  const { appointmentId, masterId } = req.params;
  const { value, comment } = req.body;
  const customerId = req.user.id;

  const isAppointment = await Appointment.findOne({ _id: appointmentId, masterId, customerId }, { _id: 1 });
  const isReview = await Review.findOne({ appointmentId, masterId, customerId }, { _id: 1 });

  // aggregate it(look up it)
  // check appointment is ended?
  if (!isAppointment) return next(new HttpError('There is no appointment'), 400);
  if (!isReview) return next(new HttpError('Review has already existed'), 400);

  // from objectId to string ?
  if (process.env.NODE_ENV !== 'development' && isEqual(customerId, masterId)) {
    return next(new HttpError('You can not add review to yourself'), 400);
  }

  await Review.updateOne({ appointmentId, masterId, customerId }, { $set: { value, comment } });

  return res.json({ message: 'Review is saved', type: 'success' });
});
