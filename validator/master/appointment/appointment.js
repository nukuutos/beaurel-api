const { check } = require('express-validator');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

const { fieldId, paramId } = require('../../utils/id');

const masterId = paramId('masterId', 'Master Id');
const serviceId = fieldId('serviceId', 'Service Id');

const timeStartAt = check('time.startAt')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Start Time is required.')
  .isInt({ min: 0, max: 1440 }) //add min and max ms
  .withMessage('Start Time must be numeric')
  .customSanitizer((time) => +time);

const timeEndAt = check('time.endAt')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('End Time is required.')
  .isInt({ min: 0, max: 1440 }) //add min and max ms
  .withMessage('Start Time must be numeric')
  .customSanitizer((time) => +time);

const date = check('date')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Date is required')
  .isISO8601()
  .withMessage('Incorrect date')
  .customSanitizer((date) =>  { 
    date = dayjs(date)
    // add timezone offset and reset offset, seconds, minutes, hours
    return date.add(date.utcOffset(), 'm').utcOffset(0).second(0).minute(0).hour(0);
  })
  .custom((date, { req }) => {
    const { time : { startAt } } = req.body;

    date = date.minute(startAt)

    if (dayjs().isAfter(date)) throw new HttpError('Appointment time is expired', 400);

    return true;
  });

exports.bookAppointment = [masterId, serviceId, timeStartAt, timeEndAt, date];
