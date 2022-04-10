const dataPreparation = require('../../../../../utils/data-preparation');
const role = require('./fields/role');

const validData = { role: 'master' };
const fields = [role];
const tests = dataPreparation(fields, validData);

module.exports = tests;
