const dataPreparation = require('../../../../utils/data-preparation');
const newPasswordUpdate = require('./fields/new-password-update');
const passwordUpdate = require('./fields/password-update');

const data = {
  password: '123456',
  newPassword: '1234567',
  newConfirmedPassword: '1234567',
};

const fields = [newPasswordUpdate, passwordUpdate];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
