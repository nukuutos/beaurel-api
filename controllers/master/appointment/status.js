const Appointment = require('../../../models/master/appointment/appointment');
const asyncHandler = require('../../../middleware/async-handler');

exports.updateStatusByMaster = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const masterId = req.user.id; // it can be master or customer(user)

  const statusList = ['confirmed', 'rejected'];

  if (!statusList.includes(status)) return next(new HttpError('Incorrect status', 400));

  await Appointment.updateOne({ _id: appointmentId, masterId }, { status });

  return res.json({ type: 'success', message: `Appointment is ${status}` });
});

exports.updateStatusByCustomer = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const customerId = req.user.id; // it can be master or customer(user)

  const statusList = ['cancelled'];

  if (!statusList.includes(status)) return next(new HttpError('Incorrect status', 400));

  await Appointment.updateOne({ _id: appointmentId, customerId }, { status });

  return res.json({ type: 'success', message: `Appointment is ${status}` });
});
