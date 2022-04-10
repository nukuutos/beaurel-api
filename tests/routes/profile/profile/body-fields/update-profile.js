const dataPreparation = require('../../../../utils/data-preparation');
const aboutText = require('./fields/about-text');
const firstName = require('./fields/first-name');
const lastName = require('./fields/last-name');
const city = require('./fields/city');

const data = {
  aboutText: 'something',
  firstName: 'Тест',
  lastName: 'Тестов',
  city: 'Владивосток',
};

const fields = [aboutText, firstName, lastName, city];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
