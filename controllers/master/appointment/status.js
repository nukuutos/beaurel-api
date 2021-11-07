const Appointment = require('../../../models/appointment/appointment');
const asyncHandler = require('../../../middleware/async-handler');
const HttpError = require('../../../models/utils/http-error');
const { NO_APPOINTMENT } = require('../../../config/errors/review');
const { CHANGE_STATUS } = require('../../../config/errors/appointment');

exports.updateStatusByMaster = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  const { id: masterId } = req.user;

  const appointment = await Appointment.findOne(
    { _id: appointmentId, masterId },
    { _id: 0, status: 1 }
  );

  if (!appointment) throw new HttpError(NO_APPOINTMENT, 404);

  const { status: currentStatus } = appointment;

  const immutableStatuses = ['rejected', 'history', 'cancelled', 'unsuitable'];

  if (immutableStatuses.includes(currentStatus)) throw new HttpError(CHANGE_STATUS, 400);

  await Appointment.updateOne({ _id: appointmentId, masterId }, { status });

  return res.json({ message: `Новый статус записи: ${status}` });
});

exports.updateStatusByCustomer = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  const { id: customerId } = req.user;

  const appointment = await Appointment.findOne(
    { _id: appointmentId, customerId },
    { _id: 0, status: 1 }
  );

  if (!appointment) throw new HttpError(NO_APPOINTMENT, 404);

  const { status: currentStatus } = appointment;

  const immutableStatuses = ['rejected', 'history', 'cancelled', 'unsuitable'];

  if (immutableStatuses.includes(currentStatus)) throw new HttpError(CHANGE_STATUS, 400);

  await Appointment.updateOne({ _id: appointmentId, customerId }, { status });

  return res.json({ message: `Новый статус записи: ${status}` });
});
