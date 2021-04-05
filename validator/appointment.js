const { check } = require('express-validator');

const { fieldId, paramId } = require('./utils/id');

const appointmentId = paramId('appointmentId', 'Appointment Id');
const masterId = paramId('masterId', 'Master Id');
const serviceId = fieldId('serviceId', 'Service Id');

const timeStartAt = check('time.startAt')
  .trim()
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Start Time is required.')
  .isInt() //add min and max ms
  .withMessage('Start Time must be numeric')
  .customSanitizer((time) => Number(time));

const timeEndAt = check('time.endAt')
  .trim()
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('End Time is required.')
  .isInt() //add min and max ms
  .withMessage('Start Time must be numeric')
  .customSanitizer((time) => Number(time));

const date = check('date')
  .trim()
  .exists({ checkFalsy: true, checkNull: true })
  .withMessage('Date is required')
  .isISO8601()
  .withMessage('Not a valid date')
  // .isInt()
  .customSanitizer((date) => {
    date = new Date(date);
    // date.setUTCHours(0, 0, 0, 0);
    return date;
  })
  .custom((date, { req }) => {
    const { time } = req.body;
    //60s in one minute and mili is 10^3
    // console.log(date, date.getTime(), time.startAt, date.getTime() + time.startAt * 60 * 1000);
    if (Date.now() > date.getTime() + time.startAt * 60 * 1000) throw new Error('Appointment time is expired');

    return true;
  });

exports.getMasterAppointments = [masterId]; // check type here
exports.bookAppointment = [masterId, serviceId, timeStartAt, timeEndAt, date];
exports.updateAppointment = [appointmentId, timeStartAt, timeEndAt, date];
exports.appointmentId = [appointmentId];
