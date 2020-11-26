const isEqual = require('lodash.isequal');

const Timetable = require('../models/timetable');
const Appointment = require('../models/appointment');
const HttpError = require('../models/http-error');

const asyncHandler = require('../middleware/async-handler');

const { generatePossibleAppointmentsTime, detectTimetableChanges } = require('./utils/timetable');

exports.getTimetable = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;

  let timetable = await Timetable.findOne({ masterId: masterId }, { _id: 0 });

  if (!timetable) return next(new HttpError('There is no timetable', 400));

  return res.json({ timetable });
});

// exports.createTimetable = asyncHandler(async (req, res, next) => {
//   const masterId = req.user.id;
//   const { workingDay, sessionTime, weekends } = req.body;

//   let timetable = await Timetable.findOne({ masterId }, { _id: 1 });

//   if (timetable) {
//     return next(new HttpError('You already have a timetable', 400));
//   }

//   const { startAt, endAt } = workingDay;

//   const possibleAppointmentsTime = generatePossibleAppointmentsTime(startAt, endAt, sessionTime);

//   timetable = new Timetable(masterId, workingDay, sessionTime, weekends, possibleAppointmentsTime);

//   await timetable.save();
//   return res.json({ message: 'Timetable is created' });
// });

// // prevoius status?
// exports.updateTimetable = asyncHandler(async (req, res, next) => {
//   const masterId = req.user.id;
//   const { timetableId } = req.params;
//   const { workingDay, sessionTime, weekends, date } = req.body;

//   // check date of update
//   if (Date.now() > date.getTime()) return next(new HttpError('Date is expired', 400)); // to validator

//   const { update, ...currentTimetable } = await Timetable.findOne(
//     { _id: timetableId },
//     {
//       _id: 0,
//       masterId: 0,
//       possibleAppointmentsTime: 0,
//       'update.possibleAppointmentsTime': 0,
//     }
//   );

//   // Check of existing update
//   if (update) return next(new HttpError('Update has already existed', 400));

//   const updatedTimetable = { workingDay, sessionTime, weekends: weekends.sort() }; // in validator sort it

//   // Check equality of current timetable and new timetable
//   if (isEqual(currentTimetable, updatedTimetable)) {
//     return next(new HttpError('Updated timetable and current timetable are same', 400));
//   }

//   const { startAt, endAt } = workingDay;

//   // Generate possible appointments time
//   const possibleAppointmentsTime = generatePossibleAppointmentsTime(startAt, endAt, sessionTime);
//   updatedTimetable.possibleAppointmentsTime = possibleAppointmentsTime;

//   // Check for updatie current appointments and services
//   const changes = detectTimetableChanges(currentTimetable, updatedTimetable);

//   await Appointment.correctByTimetableChanges(masterId, date, updatedTimetable, changes);

//   await Timetable.updateOne({ _id: timetableId, masterId }, { update: { ...updatedTimetable, date } });

//   return res.json({ message: 'Timetable is updated' });
// });

// exports.changeTimetableUpdate = asyncHandler(async (req, res, next) => {
//   const masterId = req.user.id;
//   const { timetableId } = req.params;
//   const { workingDay, sessionTime, weekends, date } = req.body;

//   const { update, ...currentTimetable } = await Timetable.findOne(
//     { _id: timetableId },
//     {
//       _id: 0,
//       masterId: 0,
//       possibleAppointmentsTime: 0,
//       'updates.possibleAppointmentsTime': 0,
//     }
//   );

//   // Check of existing update
//   if (!update) return next(new HttpError('Update does not exists', 400));

//   const updatedTimetable = { workingDay, sessionTime, weekends: weekends.sort() }; // in validator sort it

//   // Check equality of current timetable and new timetable
//   if (isEqual(currentTimetable, updatedTimetable)) {
//     return next(new HttpError('Updated timetable and current timetable are same', 400));
//   }

//   const { startAt, endAt } = workingDay;

//   // Generate possible appointments time
//   const possibleAppointmentsTime = generatePossibleAppointmentsTime(startAt, endAt, sessionTime);
//   updatedTimetable.possibleAppointmentsTime = possibleAppointmentsTime;

//   // Check for updatie current appointments and services
//   const changes = { ...detectTimetableChanges(currentTimetable, updatedTimetable), isTimetableUpdateChanges: true };

//   await Appointment.correctByTimetableChanges(masterId, date, updatedTimetable, changes);
//   await Timetable.updateOne({ _id: timetableId, masterId }, { update: { ...updatedTimetable, date } });

//   return res.json({ message: 'Timetable update is changed' });
// });

// exports.deleteTimetableUpdate = asyncHandler(async (req, res, next) => {
//   const masterId = req.user.id;
//   const { timetableId } = req.params;

//   const { update } = await Timetable.findById(timetableId, {
//     _id: 0,
//     update: 1,
//   });

//   if (!update) return next(new HttpError('Update does not exists', 400));

//   await Appointment.toConfirmed(masterId, update.date);
//   // await Timetable.update(timetableId, masterId, null);
//   await Timetable.updateOne({ _id: timetableId, masterId }, { update: null });

//   return res.json({ message: 'Timetable update is deleted' });
// });
