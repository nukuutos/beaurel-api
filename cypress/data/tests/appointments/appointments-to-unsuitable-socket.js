const Appointment = require('../../../../models/appointment');
const Timetable = require('../../../../models/timetable');
const User = require('../../../../models/user');
const confirmedAppointmentCustomer = require('../../appointments/confirmed-appointment-customer');
const customer = require('../../masters/customer');
const master = require('../../masters/master');
const autoTimetable = require('../../timetables/auto-timetable');

const appointmentsToUnsuitable = async () => {
  await User.insertMany([master, customer]);
  await Timetable.save(autoTimetable);
  await Appointment.save(confirmedAppointmentCustomer);
  return null;
};

module.exports = appointmentsToUnsuitable;
