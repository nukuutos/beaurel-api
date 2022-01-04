const dataPreparation = require('../../utils/data-preparation');
const phone = require('./fields/phone');
const firstName = require('./fields/first-name');
const lastName = require('./fields/last-name');
const passwordSignUp = require('./fields/password-sign-up');
const specialization = require('./fields/specialization');

const dataCustomer = {
  phone: '+79999999999',
  password: '123456',
  confirmedPassword: '123456',
  firstName: 'Тест',
  lastName: 'Тестов',
};

const dataMaster = {
  phone: '+79999999999',
  password: '123456',
  specialization: 'Визажист',
  confirmedPassword: '123456',
  firstName: 'Тест',
  lastName: 'Тестов',
};

const fieldsCustomer = [phone, passwordSignUp, firstName, lastName];
const fieldsMaster = [phone, passwordSignUp, firstName, lastName, specialization];

const fieldsCustomerTests = dataPreparation(fieldsCustomer, dataCustomer);
const fieldsMasterTests = dataPreparation(fieldsMaster, dataMaster);

const fieldsTests = [...fieldsCustomerTests, ...fieldsMasterTests];

module.exports = fieldsTests;
