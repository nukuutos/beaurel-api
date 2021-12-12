const asyncHandler = require('../../../middleware/async-handler');
const AddReview = require('../../../logic/master/appointment/review/add-review');
const UpdateReview = require('../../../logic/master/appointment/review/update-review');

exports.addReview = asyncHandler(async (req, res) => {
  const { appointmentId, masterId } = req.params;
  const { value, comment } = req.body;
  const { id: customerId } = req.user;

  const review = new AddReview({ masterId, customerId, appointmentId, value, comment });

  await review.checkAppointment();
  await review.checkReview().checkMasterAndCustomer().save();

  return res.status(201).json({ message: 'Отзыв сохранён!' });
});

exports.updateReview = asyncHandler(async (req, res) => {
  const { appointmentId, masterId } = req.params;
  const { value, comment } = req.body;
  const { id: customerId } = req.user;

  const review = new UpdateReview({ masterId, customerId, appointmentId, value, comment });

  await review.checkAppointment();
  await review.checkReview().checkMasterAndCustomer().save();

  return res.json({ message: 'Отзыв обновлён!' });
});
