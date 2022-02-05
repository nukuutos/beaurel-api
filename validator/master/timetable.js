const dayjs = require('dayjs');
const { body, paramId } = require('express-validator');
const { TIMETABLE_ID, MASTER_ID } = require('../../config/id-names');

const {
  SESSION_TIME_REQUIRED,
  SESSION_TIME_DURATION,
  TYPE_REQUIRED,
  INVALID_TYPE,
  UPDATE_DATE_REQUIRED,
  INVALID_UPDATE_DATE,
  START_DAY_TIME_REQUIRED,
  INVALID_START_DAY_TIME,
  END_DAY_TIME_REQUIRED,
  INVALID_END_DAY_TIME,
  START_TIME_OVER_END_TIME,
  WEEKENDS_REQUIRED,
  INVALID_WEEKENDS,
  INVALID_EXCEPTIONS,
  EXCEPTIONS_REQUIRED,
  MANUALLY_APPOINTMENTS_REQUIRED,
  INVALID_MANUALLY_APPOINTMENTS,
} = require('../../config/errors/timetable');

const timetableId = paramId('timetableId', TIMETABLE_ID);
const masterId = paramId('masterId', MASTER_ID);

// general
const sessionTime = body('sessionTime')
  .exists({ checkFalsy: true })
  .withMessage(SESSION_TIME_REQUIRED)
  .customSanitizer((num) => +num)
  .isIn([30, 60, 90, 120])
  .withMessage(SESSION_TIME_DURATION);

const type = body('type')
  .exists({ checkFalsy: true })
  .withMessage(TYPE_REQUIRED)
  .isIn(['auto', 'manually'])
  .withMessage(INVALID_TYPE);

const date = body('date')
  .exists({ checkFalsy: true })
  .withMessage(UPDATE_DATE_REQUIRED)
  .customSanitizer((date) => dayjs(date).utc())
  .custom((date) => date.isTimeReseted())
  .withMessage(INVALID_UPDATE_DATE)
  .custom((date) => {
    const todayUTC = dayjs().getTodayUTC();
    return date.isAfter(todayUTC);
  })
  .withMessage(INVALID_UPDATE_DATE);

// auto
const workingDayStartAt = body('auto.workingDay.startAt')
  .exists({ checkFalsy: true })
  .withMessage(START_DAY_TIME_REQUIRED)
  .isInt({ min: 0, max: 1440 })
  .withMessage(INVALID_START_DAY_TIME)
  .customSanitizer((num) => +num);

const workingDayEndAt = body('auto.workingDay.endAt')
  .exists({ checkFalsy: true })
  .withMessage(END_DAY_TIME_REQUIRED)
  .isInt({ min: 0, max: 1440 })
  .withMessage(INVALID_END_DAY_TIME)
  .customSanitizer((num) => +num)
  .custom((endAt, { req }) => {
    const { startAt } = req.body.auto.workingDay;
    return endAt > startAt;
  })
  .withMessage(START_TIME_OVER_END_TIME);

const weekendsArray = body('auto.weekends')
  .exists({ checkFalsy: true })
  .withMessage(WEEKENDS_REQUIRED)
  .isArray({ min: 0, max: 7 })
  .withMessage(INVALID_WEEKENDS);

const weekends = body('auto.weekends.*')
  .isInt({ min: 0, max: 6 })
  .withMessage(INVALID_WEEKENDS)
  .customSanitizer((num) => +num);

const exceptionObject = body('auto.exceptions')
  .exists({ checkFalsy: true })
  .withMessage(EXCEPTIONS_REQUIRED)
  .custom((value) => {
    const isCorrectType = typeof value === 'object';
    const isArray = Array.isArray(value);
    const isNull = value === null;

    return isCorrectType && !isArray && !isNull;
  })
  .withMessage(INVALID_EXCEPTIONS)
  .custom((object) => {
    const keys = Object.keys(object);
    return keys.length === 7;
  })
  .withMessage(INVALID_EXCEPTIONS)
  .custom((value) => {
    const keys = Object.keys(value);

    for (let i = 0; i < 7; i++) {
      if (Number(keys[i]) !== i) return false;
    }

    return true;
  })
  .withMessage(INVALID_EXCEPTIONS);

const exceptionDay = body('auto.exceptions.*')
  .isArray({ min: 0, max: 48 }) // 1440min / 30min = 48
  .withMessage(INVALID_EXCEPTIONS);

const exceptions = body('auto.exceptions.*.*')
  .isInt({ min: 0, max: 1440 })
  .withMessage(INVALID_EXCEPTIONS)
  .customSanitizer((num) => +num);

const manuallyAppointmentsObject = body('manually.appointments')
  .exists({ checkFalsy: true })
  .withMessage(MANUALLY_APPOINTMENTS_REQUIRED)
  .custom((value) => {
    const isCorrectType = typeof value === 'object';
    const isArray = Array.isArray(value);
    const isNull = value === null;

    return isCorrectType && !isArray && !isNull;
  })
  .withMessage(INVALID_MANUALLY_APPOINTMENTS)
  .custom((object) => {
    const keys = Object.keys(object);
    return keys.length === 7;
  })
  .withMessage(INVALID_MANUALLY_APPOINTMENTS)
  .custom((value) => {
    const keys = Object.keys(value);

    for (let i = 0; i < 7; i++) {
      if (Number(keys[i]) !== i) return false;
    }

    return true;
  })
  .withMessage(INVALID_MANUALLY_APPOINTMENTS);

const manuallyDay = body('manually.appointments.*')
  .isArray({ min: 0, max: 48 }) // 1440min / 30min = 48
  .withMessage(INVALID_MANUALLY_APPOINTMENTS);

const manuallyAppointments = body('manually.appointments.*.*')
  .isInt({ min: 0, max: 1440 })
  .withMessage(INVALID_MANUALLY_APPOINTMENTS)
  .customSanitizer((num) => +num);

const auto = [
  workingDayStartAt,
  workingDayEndAt,
  weekendsArray,
  weekends,
  exceptionObject,
  exceptionDay,
  exceptions,
];

const manually = [manuallyAppointmentsObject, manuallyDay, manuallyAppointments];

exports.getTimetable = [masterId];
exports.createTimetable = [masterId, type, sessionTime, ...auto, ...manually];
exports.updateTimetable = [masterId, timetableId, type, sessionTime, ...auto, ...manually, date];
exports.deleteTimetableUpdate = [masterId, timetableId];
exports.getTimetableAndAppointments = [masterId];
