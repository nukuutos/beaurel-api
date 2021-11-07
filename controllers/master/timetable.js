const Timetable = require('../../models/timetable/timetable');
const HttpError = require('../../models/utils/http-error');

const asyncHandler = require('../../middleware/async-handler');

const Service = require('../../models/service/service');
const Appointment = require('../../models/appointment/appointment');
const AutoGenerator = require('../../models/timetable/timetable-generator/auto-generator');
const TimetableGenerator = require('../../models/timetable/timetable-generator/timetable-generator');
const ManuallyGenerator = require('../../models/timetable/timetable-generator/manually-generator');
const { NO_TIMETABLE, NO_UPDATE } = require('../../config/errors/timetable');

exports.getTimetableAndAppointments = asyncHandler(async (req, res) => {
  const { masterId } = req.params;

  const { timetable, appointments } = await Timetable.getTimetableAndAppointments(masterId);

  return res.json({ timetable, appointments: appointments || [] });
});

exports.updateTimetable = asyncHandler(async (req, res) => {
  const { masterId, timetableId } = req.params;
  const { date, ...updatedTimetable } = req.body;

  const { timezone, ...currentTimetable } = await Timetable.getDataForUpdate(timetableId, masterId);

  let timetable = new TimetableGenerator({ ...currentTimetable, masterId });

  timetable.isUpdate().addUpdate(updatedTimetable);

  const { update } = timetable;

  if (update.type === 'auto') {
    timetable = new AutoGenerator({ ...update, timetableId, masterId });
    timetable.getPossibleAppointmentsTime().checkExceptions();
  } else {
    timetable = new ManuallyGenerator({ ...update, timetableId, masterId });
    timetable.checkAppointments();
  }

  const { difference } = timetable.getDifference(currentTimetable).checkDifference();

  //  dateTz is saved to db but every next search query executes by reseted utc date
  const dateTz = date.toLocalTimeInUTC(timezone);
  await timetable.makeUpdate(dateTz);

  const { sessionTime } = update;
  const defaultParams = { masterId, date: date.toDate(), changes: difference };
  await Appointment.toUnsuitable({ ...defaultParams, updatedTimetable });

  const unsuitableServices = await Service.toUnsuitable({
    ...defaultParams,
    date: dateTz.toDate(),
    sessionTime,
  });

  return res.json({
    message: 'Расписание обновлено!',
    unsuitableServices,
  });
});

exports.deleteTimetableUpdate = asyncHandler(async (req, res) => {
  const { masterId, timetableId } = req.params;

  const timetable = await Timetable.findOne({ _id: timetableId, masterId }, { _id: 0, update: 1 });

  if (!timetable) throw new HttpError(NO_TIMETABLE, 404);
  if (!timetable.update) throw new HttpError(NO_UPDATE, 404);

  await Appointment.toOnConfirmation(masterId);
  await Service.cancelUpdates(masterId);
  await Timetable.cancelUpdate(timetableId);

  return res.json({ message: 'Обновление отменено!' });
});
