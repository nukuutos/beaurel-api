const dataPreparation = require('../../../../utils/data-preparation');
const username = require('./fields/username');

const data = {
  username: 'test',
};

const fields = [username];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
