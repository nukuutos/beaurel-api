const { paramId } = require('../../utils/id');
const { body } = require('express-validator');

const appointmentId = paramId('appointmentId', 'Appointment Id');
const masterId = paramId('masterId', 'Master Id');

const masterStatuses = body('status').custom((status) => {
  const statusList = ['confirmed', 'rejected'];

  if (!statusList.includes(status)) throw new HttpError('Incorrect status', 400);
  return true;
});

const customerStatuses = body('status').custom((status) => {
  const statusList = ['cancelled'];

  if (!statusList.includes(status)) throw new HttpError('Incorrect status', 400);
  return true;
});

exports.updateStatusByMaster = [masterId, appointmentId, masterStatuses];
exports.updateStatusByCustomer = [masterId, appointmentId, customerStatuses];
