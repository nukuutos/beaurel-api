const { body, paramId } = require('express-validator');
const { INVALID_STATUS, STATUS_REQUIRED } = require('../../../config/errors/appointment');
const { APPOINTMENT_ID, MASTER_ID } = require('../../../config/id-names');

const appointmentId = paramId('appointmentId', APPOINTMENT_ID);
const masterId = paramId('masterId', MASTER_ID);

const masterStatuses = body('status')
  .exists({ checkFalsy: true })
  .withMessage(STATUS_REQUIRED)
  .isIn(['confirmed', 'rejected', 'cancelled'])
  .withMessage(INVALID_STATUS);

const customerStatuses = body('status')
  .exists({ checkFalsy: true })
  .withMessage(STATUS_REQUIRED)
  .isIn(['cancelled'])
  .withMessage(INVALID_STATUS);

exports.updateStatusByMaster = [masterId, appointmentId, masterStatuses];
exports.updateStatusByCustomer = [masterId, appointmentId, customerStatuses];
