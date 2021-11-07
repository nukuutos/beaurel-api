const dataPreparation = require('../../../utils/data-preparation');
const title = require('./fields/title');
const duration = require('./fields/duration');
const price = require('./fields/price');
const parameter = require('./fields/parameter');
const subServices = require('./fields/sub-services');
const wrapDataByArray = require('../../../utils/wrap-data-by-array');

const subService = { parameter: 'супер 21см', duration: 120, price: 1234 };
const serviceParameter = {
  title: 'скукота',
  subServices: [subService],
};

const subServiceFields = [parameter, duration, price];
const subServiceTests = dataPreparation(subServiceFields, subService);
const wrappedSubServiceTests = wrapDataByArray(subServiceTests, 'subServices', serviceParameter);

const serviceParameterFields = [title, subServices];
const serviceParameterTests = dataPreparation(serviceParameterFields, serviceParameter);

const tests = [...wrappedSubServiceTests, ...serviceParameterTests];

module.exports = tests;
