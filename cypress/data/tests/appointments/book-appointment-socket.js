const Service = require('../../../../models/service');
const Timetable = require('../../../../models/timetable');
const User = require('../../../../models/user');
const customer = require('../../masters/customer');
const master = require('../../masters/master');
const service = require('../../services/service');
const autoTimetable = require('../../timetables/auto-timetable');

const bookAppointmentSocket = async () => {
  await User.insertMany([master, customer]);
  await Timetable.save(autoTimetable);
  await Service.save(service('service'));
  return null;
};

module.exports = bookAppointmentSocket;
