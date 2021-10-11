const Timetable = require("../../models/timetable/timetable");
const HttpError = require("../../models/utils/http-error");

const asyncHandler = require("../../middleware/async-handler");

const Service = require("../../models/service/service");
const Appointment = require("../../models/appointment/appointment");
const AutoGenerator = require("../../models/timetable/timetable-generator/auto-generator");
const TimetableGenerator = require("../../models/timetable/timetable-generator/timetable-generator");
const ManuallyGenerator = require("../../models/timetable/timetable-generator/manually-generator");
const { NO_TIMETABLE, NO_UPDATE } = require("../../config/errors/timetable");

exports.getTimetableAndAppointments = asyncHandler(async (req, res) => {
  const { masterId } = req.params;

  const { timetable, appointments } = await Timetable.getTimetableAndAppointments(masterId);

  if (!timetable) throw new HttpError(NO_TIMETABLE, 400);

  return res.json({ timetable, appointments: appointments || [] });
});

exports.updateTimetable = asyncHandler(async (req, res) => {
  const { masterId, timetableId } = req.params;
  let { date, ...updatedTimetable } = req.body;

  const find = { _id: timetableId, masterId };
  const projection = { _id: 0, masterId: 0, "auto.possibleAppointmentsTime": 0 };
  const { update: isUpdate, timezone, ...currentTimetable } = await Timetable.findOne(
    find,
    projection
  );

  let timetable = new TimetableGenerator({ ...currentTimetable, update: isUpdate, masterId });

  timetable.isExisted().isUpdate().addUpdate(updatedTimetable).getDifference().checkDifference();

  const { update, difference } = timetable;

  if (update.type === "auto") {
    timetable = new AutoGenerator({ ...update, difference, timetableId, masterId });
    timetable.getPossibleAppointmentsTime().checkExceptions();
  } else {
    timetable = new ManuallyGenerator({ ...update, difference, timetableId, masterId });
    timetable.checkAppointments();
  }

  date = date.toLocalTimeInUTC("Asia/Vladivostok");
  await timetable.makeUpdate(date);

  const { sessionTime } = update;
  const defaultParams = { masterId, date, changes: difference };

  await Appointment.toUnsuitable({ ...defaultParams, updatedTimetable });
  const unsuitableServices = await Service.toUnsuitable({ ...defaultParams, sessionTime });

  return res.json({
    message: "Расписание обновлено!",
    unsuitableServices,
  });
});

exports.deleteTimetableUpdate = asyncHandler(async (req, res) => {
  const { masterId, timetableId } = req.params;

  const { update } = await Timetable.findOne({ _id: timetableId, masterId }, { _id: 0, update: 1 });

  if (!update) throw new HttpError(NO_UPDATE, 400);

  await Appointment.toOnConfirmation(masterId);
  await Service.cancelUpdates(masterId);
  await Timetable.cancelUpdate(timetableId);

  return res.json({ message: "Обновление отменено!" });
});
