const Appointment = require('../../../../models/appointment');
const User = require('../../../../models/user');
const confirmedAppointmentMaster = require('../../appointments/confirmed-appointment-master');
const master = require('../../masters/master');

const cancelledConfirmedAppointmentAsCustomer = async () => {
  await User.save(master);
  await Appointment.save(confirmedAppointmentMaster);
  return null;
};

module.exports = cancelledConfirmedAppointmentAsCustomer;
