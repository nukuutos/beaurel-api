const dataPreparation = require('../../../utils/data-preparation');
const code = require('./fields/code');
const phone = require('./fields/phone');

const data = {
  phone: '+79999999999',
  code: '1234',
};

const fields = [phone, code];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
