const dataPreparation = require('../../../../utils/data-preparation');
const title = require('./fields/title');
const duration = require('./fields/duration');
const price = require('./fields/price');

const data = {
  title: 'скукота',
  duration: 120,
  price: 50,
};

const fields = [title, duration, price];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
