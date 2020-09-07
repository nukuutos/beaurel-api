const { check } = require('express-validator');
const { paramId } = require('./utils/id');

const serviceId = paramId('serviceId', 'Service Id');

const title = check('title')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Title is required')
  .matches(/^[a-z]+$/i)
  .withMessage('Title must be alphabetic');

const duration = check('duration')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Duration is required')
  .isInt() //add min and max ms
  .withMessage('Duration must be numeric')
  .customSanitizer((num) => Number(num));

const price = check('price')
  .trim()
  .exists({ checkFalsy: true })
  .withMessage('Price is required')
  .isInt() //add min and max ms
  .withMessage('Price must be numeric')
  .customSanitizer((num) => Number(num));

const parameter = check('parameter').trim().exists().withMessage('Parameter must be a string or null');

const date = check('date')
  .isISO8601()
  .withMessage('Not a correct Date')
  .customSanitizer((date) => {
    date = new Date(date);
    date.setHours(0, 0, 0, 0);

    if (Date.now() > date.getTime()) throw new Error('Update date is incorrect');

    return date;
  });
// .custom((date) => {
// if (Date.now() > date.getTime()) throw new Error('Update date is incorrect');
//   return true;
// }),

exports.addService = [title, duration, price, parameter];
exports.updateService = [serviceId, title, duration, price, parameter, date];
exports.deleteService = [serviceId];
