const { paramId, titleId } = require('../utils/id');
const { titleValidation, durationValidation, priceValidation, parameterValidation } = require('../utils/service');
const { check } = require('express-validator');

const masterId = paramId('masterId', 'Master Id');

const subServiceId = paramId('subServiceId', 'Sub-service Id');
const serviceTitleId = titleId('serviceTitle', 'Service Title Id');

const titleService = titleValidation('service.title', "Service's Title");
const parameterService = parameterValidation('service.parameter', "Service's Parameter");
const durationService = durationValidation('service.duration', "Service's Duration");
const priceService = priceValidation('service.price', "Service's Price");

const parameterSubServiceArray = parameterValidation('service.subServices.*.parameter', 'Service Parameter');
const durationSubServiceArray = durationValidation('service.subServices.*.duration', 'Duration');
const priceSubServiceArray = priceValidation('service.subServices.*.price', 'Price');

const subServices = check('service.subServices').isArray({ min: 1 }).withMessage('Sub-services are required');

exports.addServiceParameter = [
  masterId,
  titleService,
  subServices,
  parameterSubServiceArray,
  durationSubServiceArray,
  priceSubServiceArray,
];

exports.addSubService = [masterId, serviceTitleId, parameterService, durationService, priceService];

exports.updateSubService = [masterId, serviceTitleId, subServiceId, parameterService, durationService, priceService];

exports.updateServiceParameter = [serviceTitleId, titleService];

exports.deleteSubService = [masterId, serviceTitleId, subServiceId];

exports.deleteServiceParameter = [masterId, serviceTitleId];
