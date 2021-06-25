const { check, query } = require('express-validator');

const { fieldId, paramId } = require('../../utils/id');
const HttpError = require('../../../models/http-error');

const masterId = paramId('masterId', 'Master Id');
const serviceId = fieldId('serviceId', 'Service Id');

const timeStartAt = check('time.startAt')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Start Time is required.')
  .isInt({ min: 0, max: 1440 }) //add min and max ms
  .withMessage('Start Time must be numeric')
  .customSanitizer((time) => Number(time));

const timeEndAt = check('time.endAt')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('End Time is required.')
  .isInt({ min: 0, max: 1440 }) //add min and max ms
  .withMessage('Start Time must be numeric')
  .customSanitizer((time) => Number(time));

const date = check('date')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Date is required')
  .isISO8601()
  .withMessage('Incorrect date')
  .customSanitizer((date) => {
    date = new Date(date);
    // date.setUTCHours(0, 0, 0, 0);
    return date;
  })
  .custom((date, { req }) => {
    const { time } = req.body;
    //60s in one minute and mili is 10^3
    if (Date.now() > date.getTime() + time.startAt * 60 * 1000) throw new HttpError('Appointment time is expired', 400);

    return true;
  });

exports.bookAppointment = [masterId, serviceId, timeStartAt, timeEndAt, date];
