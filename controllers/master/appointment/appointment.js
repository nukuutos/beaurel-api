const Appointment = require('../../../models/master/appointment/appointment');
const HttpError = require('../../../models/http-error');

const asyncHandler = require('../../../middleware/async-handler');

const { getWorkingTimetable, searchFreeAppointmentsTime, getWeekdayIndexRU, getStatuses } = require('./utils');

exports.bookAppointment = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;
  let { serviceId, time, date } = req.body; // change date in next lines

  const { id: customerId } = req.user;

  const { startAt, endAt } = time;
  // Get correct service by its date
  const { timetable, bookedAppointments, service } = await Appointment.getInfoForBookingAppointment(
    masterId,
    serviceId,
    date.toDate()
  );

  console.log(bookedAppointments);

  // console.log(timetable, bookedAppointments, service)

  if (!timetable) return next(new HttpError('Incorrect timetable', 404));
  if (!service) return next(new HttpError('Incorrect service', 404));

  // Choose between current timetable and its update
  const workingTimetable = getWorkingTimetable(timetable, date);
  if (!workingTimetable) return next(new HttpError('There is not correct timetable'), 400);

  const { sessionTime, auto, manually, type } = workingTimetable;

  // Check if appointment duration is not correct
  if (endAt - startAt !== service.duration) {
    return next(new HttpError('Appointment duration does not correspond to service duration'), 400);
  }

  if (type === 'auto') {
    const { weekends, possibleAppointmentsTime, exceptions } = auto;

    // Check if it is weekend
    const weekdayIndexRU = getWeekdayIndexRU(date.day());
    if (weekends.includes(weekdayIndexRU)) return next(new HttpError('It is weekend.'), 400);

    // Check for exceptions
    const dayExceptions = exceptions[weekdayIndexRU];
    if (dayExceptions.includes(startAt)) return next(new HttpError('It is exception.'), 400);

    // Check if end time of appointment is more than max time of working day
    const lastPossibleAppointment = possibleAppointmentsTime[possibleAppointmentsTime.length - 1];
    const lastPossibleAppointmentEndTime = lastPossibleAppointment + sessionTime;

    if (endAt > lastPossibleAppointmentEndTime) {
      return next(new HttpError('End time of appointment is more than max'), 400);
    }

    // Check for appointment availability
    const freeAppointmentTimes = searchFreeAppointmentsTime(bookedAppointments, possibleAppointmentsTime, sessionTime);
    for (let i = startAt; i < endAt; i += sessionTime) {
      if (!freeAppointmentTimes.includes(i)) return next(new HttpError('This time is not available', 400));
    }
  }

  if (type === 'manually') {
    const { appointments } = manually;
    // Check for existings of this time in timetable
    const weekdayIndexRU = getWeekdayIndexRU(date.getDay());
    if (!appointments[weekdayIndexRU].includes(startAt)) {
      return next(new HttpError('Incorrect time for appointment', 400));
    }

    // Check for appointment availability
    for (let i = 0; i < bookedAppointments.length; i++) {
      const bookedAppointment = bookedAppointments[i];

      // is Current Appointment Before Booked Appointment
      const isBefore = startAt < bookedAppointment.startAt && endAt <= bookedAppointment.startAt;
      // is Current Appointment After Booked Appointment
      const isAfter = startAt >= bookedAppointment.endAt && endAt < bookedAppointment.endAt;

      // if current appointment is crossing booked appointment => error
      if (!isBefore || !isAfter) return next(new HttpError('This time is not available', 400));
    }
  }

  const { _id, masterId: weDontNeedIt, ...restServiceProps } = service;

  const appointment = new Appointment(masterId, customerId, restServiceProps, time, date.toDate());
  await appointment.save();

  return res.json({ message: 'Appointment is added', type: 'success' });
});

// exports.updateAppointment = asyncHandler(async (req, res, next) => {
//   const { date, time, service } = req.body;
//   const { appointmentId } = req.params;
//   const masterId = req.user.id;
//   // change it
//   const { timetable, bookedAppointments } = await Timetable.getTimetableAndAppointmentsForUpdate(
//     masterId,
//     appointmentId,
//     date
//   ); // rename

//   const workingTimetable = getWorkingTimetable(timetable, date);
//   if (!workingTimetable) return next(new HttpError('There is not correct timetable'), 400);
//   const { sessionTime, weekends, possibleAppointmentsTime } = workingTimetable;

//   const { startAt, endAt } = time;

//   // Check for correct date
//   if (Date.now() > date.getTime() + startAt) return next(new HttpError('Appointment time is expired', 400)); // check it

//   if ((endAt - startAt) % sessionTime !== 0) {
//     return next(new HttpError('Appointment duration is incorrect', 400));
//   }

//   // Check if end time of appointment is more than max time of working day
//   const lastPossibleAppointment = possibleAppointmentsTime[possibleAppointmentsTime.length - 1];
//   const lastPossibleAppointmentEndTime = lastPossibleAppointment + sessionTime;
//   if (endAt > lastPossibleAppointmentEndTime)
//     return next(new HttpError('End time of appointment is more than max', 400));

//   // Check if it is weekend
//   if (weekends.includes(date.getDay())) return next(new HttpError('It is weekend', 400));

//   // Check for appoinment availability
//   const freeAppointmentTimes = searchFreeAppointmentsTime(bookedAppointments, possibleAppointmentsTime, sessionTime);
//   for (let i = startAt; i < endAt; i += sessionTime) {
//     if (!freeAppointmentTimes.includes(i)) return next(new HttpError('This time is not available', 400));
//   }

//   await Appointment.updateOne({ _id: appointmentId, masterId }, { service, time, date });

//   return res.json({ type: 'success', message: 'Appointment is changed' });
// });
