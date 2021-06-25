const { check } = require('express-validator');
const { paramId } = require('../utils/id');
const HttpError = require('../../models/http-error');

const timetableId = paramId('timetableId', 'Timetable Id');
const masterId = paramId('masterId', 'Master Id');

// general
const sessionTime = check('sessionTime')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Session Time is required')
  .isInt({ min: 1, max: 1440 })
  .withMessage('Session Time must be numeric')
  .customSanitizer((num) => Number(num));

const type = check('type')
  .exists({ checkFalsy: true })
  .withMessage('Type is required')
  .custom((type) => {
    const types = ['auto', 'manually'];
    if (!types.includes(type)) throw new HttpError('Incorrect type', 400);
    return true;
  });

const date = check('date')
  // .isISO8601()
  // .withMessage('Incorrect date')
  .customSanitizer((date) => {
    date = new Date(date);
    // date.setUTCHours(0, 0, 0, 0);
    return date;
  });

// auto
const workingDayStartAt = check('auto.workingDay.startAt')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Start day time is required')
  .isInt({ min: 0, max: 1440 })
  .withMessage('Start day time must be numeric')
  .customSanitizer((num) => Number(num));

const workingDayEndAt = check('auto.workingDay.endAt')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('End day time is required')
  .isInt({ min: 0, max: 1440 })
  .withMessage('End day time must be numeric')
  .customSanitizer((num) => Number(num))
  .custom((endAt, { req }) => {
    const { startAt } = req.body.auto.workingDay;
    if (endAt < startAt) {
      throw new Error('End day time cant be lesser than start day time');
    }
    return true;
  });

const weekends = check('auto.weekends.*')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Weekends are required')
  .isInt(0, 6)
  .withMessage('Weekends must be int from 0 to 6')
  .customSanitizer((num) => Number(num));

// exceptions
const exceptions = check('auto.exceptions.*.*').customSanitizer((num) => Number(num));

// manually, appointments
const appointments = check('manually.appointments.*.*').customSanitizer((num) => Number(num));

const auto = [workingDayStartAt, workingDayEndAt, weekends];
const manually = [appointments];

exports.getTimetable = [masterId];
exports.updateTimetable = [masterId, timetableId, sessionTime, ...auto, ...manually, date];
exports.deleteTimetableUpdate = [masterId, timetableId];
// exports.createTimetable = [workingDayStartAt, workingDayEndAt, sessionTime, weekends];
exports.getTimetableAndAppointments = [masterId];
