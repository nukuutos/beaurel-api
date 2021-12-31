const dataPreparation = require('../../../utils/data-preparation');
const aboutText = require('./fields/about-text');
const firstName = require('./fields/first-name');
const lastName = require('./fields/last-name');

const data = {
  aboutText: 'something',
  firstName: 'Тест',
  lastName: 'Тестов',
};

const fields = [aboutText, firstName, lastName];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
