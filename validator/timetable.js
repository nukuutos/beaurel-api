const { check } = require('express-validator');
const { paramId } = require('./utils/id');

const timetableId = paramId('timetableId', 'Timetable Id');

const workingDayStartAt = check('workingDay.startAt')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Start day time is required')
  .isInt({ min: 0, max: 86400000 }) //add min and max ms
  .withMessage('Start day time must be numeric')
  .customSanitizer((num) => Number(num));

const workingDayEndAt = check('workingDay.endAt')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('End day time is required')
  .isInt({ min: 0, max: 86400000 }) //add min and max ms
  .withMessage('End day time must be numeric')
  .customSanitizer((num) => Number(num))
  .custom((endAt, { req }) => {
    const { startAt } = req.body.workingDay;
    if (endAt < startAt) {
      throw new Error('End day time cant be lesser than start day time');
    }
    return true;
  });

const sessionTime = check('sessionTime')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Session Time is required')
  .isInt({ min: 0, max: 86400000 }) //add min and max ms
  .withMessage('Session Time must be numeric')
  .customSanitizer((num) => Number(num));

const weekends = check('weekends.*')
  .trim()
  .isInt(0, 6)
  .withMessage('Weekends must be int from 0 to 6')
  .customSanitizer((num) => Number(num));

const date = check('date')
  .isISO8601()
  .withMessage('Incorrect date')
  .customSanitizer((date) => {
    date = new Date(date);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  });

exports.createTimetable = [workingDayStartAt, workingDayEndAt, sessionTime, weekends];
exports.updateTimetable = [timetableId, workingDayStartAt, workingDayEndAt, sessionTime, weekends, date];
exports.deleteTimetableUpdate = [timetableId];
