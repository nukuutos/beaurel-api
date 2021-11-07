const { paramId, fieldId } = require('express-validator');
const { MASTER_ID, SERVICE_ID } = require('../../config/id-names');
const {
  titleValidation,
  durationValidation,
  priceValidation,
  orderValidation,
  subOrderValidation,
} = require('./utils/service');

const masterId = paramId('masterId', MASTER_ID);
const serviceId = paramId('serviceId', SERVICE_ID);
const serviceIdOrder = fieldId('newOrder.*.id', SERVICE_ID);

// service
const titleService = titleValidation('title');
const durationService = durationValidation('duration');
const priceService = priceValidation('price');
const orderService = orderValidation('newOrder.*.order');
const subOrderService = subOrderValidation('newOrder.*.subOrder');

// update service
const updatingServiceId = fieldId('services.*.id', SERVICE_ID);
const updatingServiceDuration = durationValidation('services.*.duration');

exports.getServices = [masterId];
exports.addService = [masterId, titleService, durationService, priceService];
exports.updateServicesOrder = [masterId, serviceIdOrder, orderService, subOrderService];
exports.getUnsuitableServices = [masterId];
exports.putUpdateToServices = [masterId, updatingServiceId, updatingServiceDuration];
exports.updateService = [masterId, serviceId, titleService, durationService, priceService];
exports.deleteService = [masterId, serviceId];
