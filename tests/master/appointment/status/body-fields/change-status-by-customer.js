const dataPreparation = require('../../../../utils/data-preparation');
const customerStatuses = require('./fields/customer-statuses');

const data = {
  status: 'cancelled',
};

const fields = [customerStatuses];

const fieldsTests = dataPreparation(fields, data);

module.exports = fieldsTests;
