const { paramId, fieldId } = require('../utils/id');
const {
  titleValidation,
  durationValidation,
  priceValidation,
  orderValidation,
  subOrderValidation,
} = require('../utils/service');

const masterId = paramId('masterId', 'Master Id');
const serviceId = paramId('serviceId', 'Service Id');
const serviceIdOrder = fieldId('newOrder.*.id', 'Service Id');

// service
const titleService = titleValidation('service.title', "Service's Title");
const durationService = durationValidation('service.duration', "Service's Duration");
const priceService = priceValidation('service.price', "Service's Price");
const orderService = orderValidation('newOrder.*.order', "Service's Order");
const subOrderService = subOrderValidation('newOrder.*.subOrder', "Service's Sub-Order");

// update service
const updatingServiceDuration = durationValidation('services.*.duration', 'Duration of updating service');
const updatingServiceId = fieldId('services.*.id', 'Id of updating service');

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

exports.updateServicesOrder = [masterId, serviceIdOrder, orderService, subOrderService];

exports.getUnsuitableServices = [masterId];

exports.putUpdateToServices = [masterId, updatingServiceId, updatingServiceDuration];

exports.updateService = [masterId, serviceId, titleService, durationService, priceService];

exports.deleteService = [masterId, serviceId];
