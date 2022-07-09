const dayjs = require('dayjs');
const cloneDeep = require('lodash.clonedeep');
const Appointment = require('../../../../models/appointment');
const Timetable = require('../../../../models/timetable');
const User = require('../../../../models/user');
const unsuitableAppointmentMaster = require('../../appointments/unsuitable-appointment-master');
const master = require('../../masters/master');
const autoTimetableWithUpdate = require('../../timetables/auto-timetable-with-update');

const timetable = cloneDeep(autoTimetableWithUpdate);
const appointment = cloneDeep(unsuitableAppointmentMaster);

const addDataForUpdateUnsuitableAppointmentBeforeUpdate = async () => {
  timetable.auto.weekends = [];
  timetable.update.date = dayjs().startOf('day').add(5, 'day').utc().toDate();
  appointment.date = dayjs().startOf('day').add(8, 'day').utc().toDate();

  await Timetable.save(timetable);
  await User.save(master);
  await Appointment.save(appointment);

  return null;
};

module.exports = addDataForUpdateUnsuitableAppointmentBeforeUpdate;
