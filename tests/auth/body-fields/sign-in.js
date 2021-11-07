const dataPreparation = require('../../utils/data-preparation');
const email = require('./fields/email');
const passwordSignIn = require('./fields/password-sign-in');

const data = {
  email: 'nukuutos@gmail.com',
  password: '123456',
};

const fields = [email, passwordSignIn];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
