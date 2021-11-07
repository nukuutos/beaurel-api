const dataPreparation = require('../../../../utils/data-preparation');
const masterStatuses = require('./fields/master-statuses');

const data = {
  status: 'confirmed',
};

const fields = [masterStatuses];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
