const dayjs = require('dayjs');
const { body, fieldId, paramId } = require('express-validator');

const { MASTER_ID, SERVICE_ID, APPOINTMENT_ID } = require('../../../config/id-names');

const {
  APPOINTMENT_START_REQUIRED,
  INVALID_APPOINTMENT_START,
  APPOINTMENT_END_REQUIRED,
  INVALID_APPOINTMENT_END,
  DATE_REQUIRED,
  INVALID_DATE,
} = require('../../../config/errors/appointment');
const { durationValidation } = require('../utils/service');

const masterId = paramId('masterId', MASTER_ID);
const appointmentId = paramId('appointmentId', APPOINTMENT_ID);
const serviceId = fieldId('serviceId', SERVICE_ID);

const duration = durationValidation('duration');

const timeStartAt = body('time.startAt')
  .exists({ checkFalsy: true })
  .withMessage(APPOINTMENT_START_REQUIRED)
  .isInt({ min: 0, max: 1440 })
  .withMessage(INVALID_APPOINTMENT_START)
  .customSanitizer((time) => +time);

const timeEndAt = body('time.endAt')
  .exists({ checkFalsy: true })
  .withMessage(APPOINTMENT_END_REQUIRED)
  .isInt({ min: 0, max: 1440 })
  .withMessage(INVALID_APPOINTMENT_END)
  .customSanitizer((time) => +time);

const date = body('date')
  .exists({ checkFalsy: true })
  .withMessage(DATE_REQUIRED)
  .trim()
  .isISO8601()
  .withMessage(INVALID_DATE)
  .customSanitizer((date) => dayjs(date).utc())
  .custom((date) => date.isTimeReseted())
  .withMessage(INVALID_DATE)
  .custom((date) => {
    const todayUTC = dayjs().getTodayUTC();
    return date.isAfter(todayUTC);
  })
  .withMessage(INVALID_DATE);

exports.bookAppointment = [masterId, serviceId, timeStartAt, timeEndAt, date];
exports.updateUnsuitableAppointment = [
  masterId,
  appointmentId,
  duration,
  timeStartAt,
  timeEndAt,
  date,
];
