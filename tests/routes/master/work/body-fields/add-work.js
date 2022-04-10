const dataPreparation = require('../../../../utils/data-preparation');
const title = require('./fields/title');

const data = {
  title: 'скукота',
};

const fields = [title];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
