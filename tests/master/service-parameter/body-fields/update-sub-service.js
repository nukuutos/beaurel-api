const dataPreparation = require('../../../utils/data-preparation');
const duration = require('./fields/duration');
const price = require('./fields/price');
const parameter = require('./fields/parameter');

const data = { parameter: 'супер 21см', duration: 120, price: 1234 };

const fields = [parameter, duration, price];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
