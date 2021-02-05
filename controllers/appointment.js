const Appointment = require('../models/appointment');
const Timetable = require('../models/timetable');
const User = require('../models/user');
const HttpError = require('../models/http-error');

const asyncHandler = require('../middleware/async-handler');

const { getWorkingTimetable, searchFreeAppointmentsTime } = require('./utils/appointment');

//  get controller (appointments with timetable)
// exports.getAppointmetns;

exports.bookAppointment = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;
  const { serviceId, time, date } = req.body;
  const customerId = req.user.id;

  const { startAt, endAt } = time;
  // Get correct service by its date
  const { timetable, bookedAppointments, service } = await User.getInfoForBookingAppointment(masterId, serviceId, date);

  if (!service) return next(new HttpError('There is not this service', 404));

  // Choose between current timetable and its update
  const workingTimetable = getWorkingTimetable(timetable, date);
  if (!workingTimetable) return next(new HttpError('There is not correct timetable'), 400);

  const { sessionTime, weekends, possibleAppointmentsTime } = workingTimetable;

  // Check if appointment duration is correct
  if (endAt - startAt !== service.duration) {
    return next(new HttpError('Appointment duration does not correspond to service duration'), 400);
  }

  // Check if end time of appointment is more than max time of working day
  const lastPossibleAppointment = possibleAppointmentsTime[possibleAppointmentsTime.length - 1];
  const lastPossibleAppointmentEndTime = lastPossibleAppointment + sessionTime;

  if (endAt > lastPossibleAppointmentEndTime) {
    return next(new HttpError('End time of appointment is more than max'), 400);
  }

  // Check if it is weekend
  if (weekends.includes(date.getDay())) return next(new HttpError('It is weekend'), 400);

  // Check for appoinment availability
  const freeAppointmentTimes = searchFreeAppointmentsTime(bookedAppointments, possibleAppointmentsTime, sessionTime);
  for (let i = startAt; i < endAt; i += sessionTime) {
    if (!freeAppointmentTimes.includes(i)) return next(new HttpError('This time is not available', 400));
  }

  const appointment = new Appointment(masterId, customerId, service, time, date);

  await appointment.save();

  return res.json({ message: 'Appointment is added', type: 'success' });
});

exports.updateAppointment = asyncHandler(async (req, res, next) => {
  const { date, time, service } = req.body;
  const { appointmentId } = req.params;
  const masterId = req.user.id;
  // change it
  const { timetable, bookedAppointments } = await Timetable.getTimetableAndAppointmentsForUpdate(
    masterId,
    appointmentId,
    date
  ); // rename

  const workingTimetable = getWorkingTimetable(timetable, date);
  if (!workingTimetable) return next(new HttpError('There is not correct timetable'), 400);
  const { sessionTime, weekends, possibleAppointmentsTime } = workingTimetable;

  const { startAt, endAt } = time;

  // Check for correct date
  if (Date.now() > date.getTime() + startAt) return next(new HttpError('Appointment time is expired', 400)); // check it

  if ((endAt - startAt) % sessionTime !== 0) {
    return next(new HttpError('Appointment duration is incorrect', 400));
  }

  // Check if end time of appointment is more than max time of working day
  const lastPossibleAppointment = possibleAppointmentsTime[possibleAppointmentsTime.length - 1];
  const lastPossibleAppointmentEndTime = lastPossibleAppointment + sessionTime;
  if (endAt > lastPossibleAppointmentEndTime)
    return next(new HttpError('End time of appointment is more than max', 400));

  // Check if it is weekend
  if (weekends.includes(date.getDay())) return next(new HttpError('It is weekend', 400));

  // Check for appoinment availability
  const freeAppointmentTimes = searchFreeAppointmentsTime(bookedAppointments, possibleAppointmentsTime, sessionTime);
  for (let i = startAt; i < endAt; i += sessionTime) {
    if (!freeAppointmentTimes.includes(i)) return next(new HttpError('This time is not available', 400));
  }

  await Appointment.updateOne({ _id: appointmentId, masterId }, { service, time, date });

  return res.json({ message: 'Appointment is changed' });
});

exports.updateStatus = asyncHandler(async (req, res, next) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const role = req.user.role;
  const userId = req.user.id; // it can be master or customer(user)

  const statusList = role === 'master' ? ['confirmed', 'cancelled'] : ['cancelled'];

  if (!statusList.includes(status)) return next(new HttpError('Incorrect status', 400));

  await Appointment.updateOne({ _id: appointmentId, $or: [{ masterId: userId }, { customerId: userId }] }, { status });

  return res.json({ message: `Appointment is ${status}` });
});
