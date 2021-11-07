const dataPreparation = require('../../../utils/data-preparation');
const aboutText = require('./fields/about-text');

const data = {
  aboutText: 'something',
};

const fields = [aboutText];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
