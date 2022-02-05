const asyncHandler = require('../../middleware/async-handler');
const AutoGenerator = require('../../logic/master/timetable/timetable-update/timetable-generators/auto-generator');
const TimetableGenerator = require('../../logic/master/timetable/timetable-update/timetable-generators/timetable-generator');
const ManuallyGenerator = require('../../logic/master/timetable/timetable-update/timetable-generators/manually-generator');
const TimetableUpdate = require('../../logic/master/timetable/timetable-update/timetable-update');
const DeleteTimetableUpdate = require('../../logic/master/timetable/delete-timetable-update');
const GetTimetable = require('../../logic/master/timetable/get-timetable');
const CreateTimetable = require('../../logic/master/timetable/create-timetable');

exports.getTimetableAndAppointments = asyncHandler(async (req, res) => {
  const { masterId } = req.params;

  const { timetable, appointments } = await GetTimetable.getData(masterId);

  return res.json({ timetable, appointments: appointments || [] });
});

exports.createTimetable = asyncHandler(async (req, res) => {
  const { masterId } = req.params;
  const timetableFields = req.body;

  const data = await CreateTimetable.getData(masterId);

  data.isTimetable().isTimezone();

  const { timezone } = data;

  let timetable;

  const { type } = timetableFields;

  if (type === 'auto') {
    timetable = new AutoGenerator({ ...timetableFields, timezone, masterId });
    timetable.getPossibleAppointmentsTime().checkExceptions();
  } else {
    timetable = new ManuallyGenerator({ ...timetableFields, timezone, masterId });
    timetable.checkAppointments();
  }

  const { insertedId: _id } = await timetable.save();

  return res.status(201).json({ _id });
});

exports.updateTimetable = asyncHandler(async (req, res) => {
  const { masterId, timetableId } = req.params;
  const { date, ...updatedTimetable } = req.body;

  const { timezone, ...currentTimetable } = await TimetableUpdate.getData(timetableId, masterId);

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

  const defaultParams = { masterId, date: date.toDate(), changes: difference };

  const { unsuitableServices } = await TimetableUpdate.toUnsuitable(
    defaultParams,
    updatedTimetable,
    dateTz
  );

  return res.json({
    message: 'Расписание обновлено!',
    unsuitableServices,
  });
});

exports.deleteTimetableUpdate = asyncHandler(async (req, res) => {
  const { masterId, timetableId } = req.params;

  const timetable = await DeleteTimetableUpdate.getTimetable(masterId, timetableId);

  timetable.checkExistence();

  await DeleteTimetableUpdate.deleteUpdate(masterId, timetableId);

  return res.json({ message: 'Обновление отменено!' });
});
