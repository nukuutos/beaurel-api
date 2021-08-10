const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");

const Timetable = require("../../../models/master/timetable/timetable");
const HttpError = require("../../../models/http-error");

const asyncHandler = require("../../../middleware/async-handler");

const { generatePossibleAppointmentsTime, compareTimetables } = require("./utils");
const Service = require("../../../models/master/service/service");
const Appointment = require("../../../models/master/appointment/appointment");

dayjs.extend(timezone);

exports.getTimetable = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;

  let timetable = await Timetable.findOne({ masterId: masterId }, { _id: 0 });

  if (!timetable) return next(new HttpError("There is no timetable", 400));

  return res.json({ timetable });
});

exports.getTimetableAndAppointments = asyncHandler(async (req, res, next) => {
  const { masterId } = req.params;

  const { timetable, appointments } = await Timetable.getTimetableAndAppointments(masterId);

  if (!timetable) return next(new HttpError("There is no timetable", 400));
  // console.log(timetable, appointments);
  return res.json({ timetable, appointments: appointments || [] });
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

const checkManuallyAppointmentsTime = (current, next = null, prev = null, sessionTime) => {
  if (prev && prev + sessionTime > current) return false;
  if (next && current + sessionTime > next) return false;
  return true;
};

exports.updateTimetable = asyncHandler(async (req, res, next) => {
  const { masterId, timetableId } = req.params;

  const { sessionTime, auto, manually, type } = req.body;
  let { date } = req.body;

  // check date of update
  // if (Date.now() > date.getTime()) return next(new HttpError('Date is expired', 400)); // to validator

  const { update, timezone, ...currentTimetable } = await Timetable.findOne(
    { _id: timetableId, masterId },
    {
      _id: 0,
      masterId: 0,
      "auto.possibleAppointmentsTime": 0,
      // 'update.auto.possibleAppointmentsTime': 0,
    }
  );

  // Check has timetable existed
  if (!currentTimetable) return next(new HttpError("Your timetable has not existed", 400));

  // Check existing update
  if (update) return next(new HttpError("Update has already existed", 400));

  // date to update time in utc
  date = dayjs(date).tz(timezone); // date to master timezone
  date = date.utcOffset(0).subtract(date.utcOffset(), "minute").toDate(); // get midnight in utc for this date

  const updatedTimetable = { sessionTime, auto, manually, type };

  const difference = compareTimetables(currentTimetable, updatedTimetable);

  if (!Object.keys(difference).length) {
    return next(new HttpError("Updated timetable and current timetable are same", 400));
  }

  if (type === "auto") {
    const { workingDay, exceptions } = auto;
    const { startAt, endAt } = workingDay;

    // Generate possible appointments time
    const possibleAppointmentsTime = generatePossibleAppointmentsTime(startAt, endAt, sessionTime);
    updatedTimetable.auto.possibleAppointmentsTime = possibleAppointmentsTime;

    // check exceptions by sessionTime
    const areCorrectExceptions = Object.values(exceptions).every((day) =>
      day.every((exception) => (exception - workingDay.startAt) % sessionTime === 0)
    );

    if (!areCorrectExceptions) return next(new HttpError("Your exceptions are not correct", 400));
  } else {
    // manually case
    const { appointments } = manually;

    const areAppointmentsCorrect = Object.values(appointments).every((day) =>
      day.every((time, i) => {
        return checkManuallyAppointmentsTime(time, day[i + 1], day[i - 1], sessionTime);
      })
    );

    if (!areAppointmentsCorrect) return next(new HttpError("Your appointments are not correct", 400));
  }

  await Appointment.toUnsuitable(masterId, date, updatedTimetable, difference);

  let unsuitableServicesCount = 0;

  if (difference["sessionTime"]) {
    const {
      result: { n },
    } = await Service.updateMany(
      { masterId, duration: { $not: { $mod: [sessionTime, 0] } } },
      { update: { date, status: "unsuitable" } }
    );

    unsuitableServicesCount = n;
  }

  await Timetable.updateOne({ _id: timetableId, masterId }, { update: { ...updatedTimetable, date } });

  return res.json({ message: "Timetable is updated", unsuitableServicesCount, type: "success" });
});

exports.deleteTimetableUpdate = asyncHandler(async (req, res, next) => {
  const { masterId, timetableId } = req.params;

  const { update } = await Timetable.findOne(
    { _id: timetableId },
    {
      _id: 0,
      update: 1,
    }
  );

  if (!update) return next(new HttpError("Update does not exists", 400));

  // update appointments
  await Appointment.updateMany({ masterId, status: "unsuitable" }, { status: "onConfirmation" });
  // update services
  await Service.updateMany({ masterId, update: { $exists: true, $ne: null } }, { update: null });

  await Timetable.updateOne({ _id: timetableId, masterId }, { update: null });

  return res.json({ message: "Timetable is updated", type: "success" });
});
