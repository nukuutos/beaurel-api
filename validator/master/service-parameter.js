const { paramId, body } = require('express-validator');
const { PARAMETERS_REQUIRED } = require('../../config/errors/service');
const { MASTER_ID, SUB_SERVICE_ID, SERVICE_NAME } = require('../../config/id-names');

const {
  titleValidation,
  durationValidation,
  priceValidation,
  parameterValidation,
  titleId,
  updateDurationValidation,
} = require('./utils/service');

const masterId = paramId('masterId', MASTER_ID);

const subServiceId = paramId('subServiceId', SUB_SERVICE_ID);
const serviceTitleId = titleId('serviceTitle', SERVICE_NAME);

const titleService = titleValidation('title');
const parameterService = parameterValidation('parameter');
const durationService = durationValidation('duration');
const priceService = priceValidation('price');

const parameterSubServiceArray = parameterValidation('subServices.*.parameter');
const durationSubServiceArray = durationValidation('subServices.*.duration');
const updateDurationSubServiceArray = updateDurationValidation('subServices.*.updateDuration');
const priceSubServiceArray = priceValidation('subServices.*.price');

const subServices = body('subServices')
  .exists({ checkFalsy: true })
  .withMessage(PARAMETERS_REQUIRED)
  .isArray({ min: 1 })
  .withMessage(PARAMETERS_REQUIRED);

exports.addServiceParameter = [
  masterId,
  titleService,
  subServices,
  parameterSubServiceArray,
  durationSubServiceArray,
  updateDurationSubServiceArray,
  priceSubServiceArray,
];

exports.addSubService = [masterId, serviceTitleId, parameterService, durationService, priceService];

exports.updateSubService = [
  masterId,
  serviceTitleId,
  subServiceId,
  parameterService,
  durationService,
  priceService,
];

exports.updateServiceParameter = [masterId, serviceTitleId, titleService];

exports.deleteSubService = [masterId, serviceTitleId, subServiceId];

exports.deleteServiceParameter = [masterId, serviceTitleId];
