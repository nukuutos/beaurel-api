const dataPreparation = require('../../utils/data-preparation');
const email = require('./fields/email');
const firstName = require('./fields/first-name');
const lastName = require('./fields/last-name');
const passwordSignUp = require('./fields/password-sign-up');

const data = {
  email: 'test@test.com',
  password: '123456',
  confPassword: '123456',
  firstName: 'Тест',
  lastName: 'Тест',
};

const fields = [email, passwordSignUp, firstName, lastName];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
