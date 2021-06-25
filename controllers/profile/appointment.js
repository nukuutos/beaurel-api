const Appointment = require('../../models/master/appointment/appointment');
const asyncHandler = require('../../middleware/async-handler');

exports.getMasterAppointments = asyncHandler(async (req, res, next) => {
  const { id: masterId } = req.user;
  const { category } = req.query;

  const appointments = await Appointment.getAppointmentsAsMaster(masterId, category);

  return res.json({ appointments });
});

exports.getCustomerAppointments = asyncHandler(async (req, res, next) => {
  const { id: customerId } = req.user;
  const { category } = req.query;

  const appointments = await Appointment.getAppointmentsAsCustomer(customerId, category);

  return res.json({ appointments });
});
