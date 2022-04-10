const dataPreparation = require('../../../utils/data-preparation');
const code = require('./fields/code');
const newPassword = require('./fields/new-password');
const phone = require('./fields/phone');

const data = {
  phone: '+79999999999',
  code: '1234',
  newPassword: '1234567',
  newConfirmedPassword: '1234567',
};

const fields = [phone, code, newPassword];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
