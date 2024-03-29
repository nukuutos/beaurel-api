const dayjs = require('dayjs');
const { body, fieldId, paramId, query } = require('express-validator');

const { MASTER_ID, SERVICE_ID, APPOINTMENT_ID } = require('../../../config/id-names');

const {
  APPOINTMENT_START_REQUIRED,
  INVALID_APPOINTMENT_START,
  APPOINTMENT_END_REQUIRED,
  INVALID_APPOINTMENT_END,
  DATE_REQUIRED,
  INVALID_DATE,
  ROLE_REQUIRED,
  INVALID_ROLE,
} = require('../../../config/errors/appointment');
const { durationValidation } = require('../utils/service');

const masterId = paramId('masterId', MASTER_ID);
const appointmentId = paramId('appointmentId', APPOINTMENT_ID);
const serviceId = fieldId('serviceId', SERVICE_ID);

const duration = durationValidation('duration');

const minsInDay = 1440;
const firstAppointmentStartAt = 480;

const timeStartAt = body('time.startAt')
  .exists({ checkFalsy: true })
  .withMessage(APPOINTMENT_START_REQUIRED)
  .isInt({ min: firstAppointmentStartAt, max: minsInDay })
  .withMessage(INVALID_APPOINTMENT_START)
  .customSanitizer((time) => +time);

const timeEndAt = body('time.endAt')
  .exists({ checkFalsy: true })
  .withMessage(APPOINTMENT_END_REQUIRED)
  .isInt({ min: 0, max: minsInDay + firstAppointmentStartAt })
  .withMessage(INVALID_APPOINTMENT_END)
  .customSanitizer((time) => +time);

const dateBody = body('date')
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

const dateQuery = query('date')
  .exists({ checkFalsy: true })
  .withMessage(DATE_REQUIRED)
  .trim()
  .isISO8601()
  .withMessage(INVALID_DATE)
  .customSanitizer((date) => dayjs(date).utc())
  .custom((date) => date.isTimeReseted())
  .withMessage(INVALID_DATE);

const role = body('role')
  .exists({ checkFalsy: true })
  .withMessage(ROLE_REQUIRED)
  .isIn(['customer', 'master'])
  .withMessage(INVALID_ROLE);

exports.updateViewedState = [masterId, appointmentId, role];
exports.bookAppointment = [masterId, serviceId, timeStartAt, timeEndAt, dateBody];
exports.getBookedAppointments = [masterId, dateQuery];
exports.updateUnsuitableAppointment = [
  masterId,
  appointmentId,
  duration,
  timeStartAt,
  timeEndAt,
  dateBody,
];
