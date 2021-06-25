const Appointment = require('../../../models/master/appointment/appointment');
const asyncHandler = require('../../../middleware/async-handler');

exports.updateStatusByMaster = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const { id: masterId } = req.user;

  await Appointment.updateOne({ _id: appointmentId, masterId }, { status });

  return res.json({ type: 'success', message: `Appointment is ${status}` });
});

exports.updateStatusByCustomer = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const { id: customerId } = req.user;

  await Appointment.updateOne({ _id: appointmentId, customerId }, { status });

  return res.json({ type: 'success', message: `Appointment is ${status}` });
});
