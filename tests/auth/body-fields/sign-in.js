const dataPreparation = require('../../utils/data-preparation');
const identificator = require('./fields/identificator');
const passwordSignIn = require('./fields/password-sign-in');

const data = {
  identificator: 'nukuutos@gmail.com',
  password: '123456',
};

const fields = [identificator, passwordSignIn];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
