const Review = require("../../../models/review");

const asyncHandler = require("../../../middleware/async-handler");

exports.addReview = asyncHandler(async (req, res) => {
  const { appointmentId, masterId } = req.params;
  const { value, comment } = req.body;
  const { id: customerId } = req.user;

  const review = new Review({ masterId, customerId, appointmentId });

  await review.checkAppointmentAndReview("add");

  await review.checkMasterAndCustomer().addValueAndComment(value, comment).save();

  return res.status(201).json({ message: "Отзыв сохранён!" });
});

exports.updateReview = asyncHandler(async (req, res) => {
  const { appointmentId, masterId } = req.params;
  const { value, comment } = req.body;
  const { id: customerId } = req.user;

  const review = new Review({ masterId, customerId, appointmentId });

  await review.checkAppointmentAndReview("update");

  await review.checkMasterAndCustomer().addValueAndComment(value, comment).save();

  return res.json({ message: "Отзыв обновлён!" });
});
