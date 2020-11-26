const { paramId } = require('./utils/id');
const { titleValidation, durationValidation, priceValidation } = require('./utils/service');

const masterId = paramId('masterId', 'Master Id');
const serviceId = paramId('serviceId', 'Service Id');

// service
const titleService = titleValidation('service.title', "Service's Title");
const durationService = durationValidation('service.duration', "Service's Duration");
const priceService = priceValidation('service.price', "Service's Price");

// const date = check('date')
//   .isISO8601()
//   .withMessage('Not a correct Date')
//   .customSanitizer((date) => {
//     date = new Date(date);
//     date.setHours(0, 0, 0, 0);

//     if (Date.now() > date.getTime()) throw new Error('Update date is incorrect');

//     return date;
//   });
// .custom((date) => {
// if (Date.now() > date.getTime()) throw new Error('Update date is incorrect');
//   return true;
// }),

exports.getServices = [masterId];

exports.addService = [masterId, titleService, durationService, priceService];

exports.updateService = [masterId, serviceId, titleService, durationService, priceService];

exports.deleteService = [masterId, serviceId];
