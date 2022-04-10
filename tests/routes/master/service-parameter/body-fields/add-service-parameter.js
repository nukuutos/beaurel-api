const cloneDeep = require('lodash.clonedeep');
const dataPreparation = require('../../../../utils/data-preparation');
const title = require('./fields/title');
const duration = require('./fields/duration');
const price = require('./fields/price');
const parameter = require('./fields/parameter');
const updateDuration = require('./fields/update-duration');

const parameterForTest = cloneDeep(parameter);
const durationForTest = cloneDeep(duration);
const priceForTest = cloneDeep(price);
const updateDurationForTest = cloneDeep(updateDuration);

parameterForTest.name = 'subServices.parameter';
durationForTest.name = 'subServices.duration';
priceForTest.name = 'subServices.price';
updateDurationForTest.name = 'subServices.updateDuration';

const serviceParameter = {
  title: 'скукота',
  subServices: [{ parameter: 'супер 21см', duration: 120, price: 1234 }],
};

const fields = [title, parameterForTest, durationForTest, priceForTest, updateDurationForTest];
const tests = dataPreparation(fields, serviceParameter);

module.exports = tests;
