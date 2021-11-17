const asyncHandler = require('../../../middleware/async-handler');
const ChangeStatusByMaster = require('../../../logic/master/appointment/status/change-status-by-master');
const ChangeStatusByCustomer = require('../../../logic/master/appointment/status/change-status-by-customer');

exports.updateStatusByMaster = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  const { id: masterId } = req.user;

  const appointment = await ChangeStatusByMaster.getAppointment(appointmentId, masterId);

  await appointment.isExisted().checkImmutableStatuses().update(status);

  return res.json({ message: `Новый статус записи: ${status}` });
});

exports.updateStatusByCustomer = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;
  const { id: customerId } = req.user;

  const appointment = await ChangeStatusByCustomer.getAppointment(appointmentId, customerId);

  await appointment.isExisted().checkImmutableStatuses().update(status);

  return res.json({ message: `Новый статус записи: ${status}` });
});
