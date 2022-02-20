const Appointment = require('../../logic/profile/appointment/appointment');
const asyncHandler = require('../../middleware/async-handler');

exports.getMasterAppointments = asyncHandler(async (req, res) => {
  const { id: masterId } = req.user;
  const { category, page } = req.query;

  const appointments = await Appointment.getAppointmentsAsMaster(masterId, category, page);

  const isAppointments = Object.keys(appointments).length;

  if (isAppointments) Appointment.setMasterAppointmentsViewed(appointments);

  return res.json({ appointments });
});

exports.getCustomerAppointments = asyncHandler(async (req, res) => {
  const { id: customerId } = req.user;
  const { category, page } = req.query;

  const appointments = await Appointment.getAppointmentsAsCustomer(customerId, category, page);

  const isAppointments = Object.keys(appointments).length;

  if (isAppointments) Appointment.setCustomerAppointmentsViewed(appointments);

  return res.json({ appointments });
});
