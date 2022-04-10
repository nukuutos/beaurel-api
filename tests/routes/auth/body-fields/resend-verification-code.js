const dataPreparation = require('../../../utils/data-preparation');
const phone = require('./fields/phone');

const data = {
  phone: '+79999999999',
};

const fields = [phone];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
