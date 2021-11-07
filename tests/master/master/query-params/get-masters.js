const dataPreparation = require('../../../utils/data-preparation');
const name = require('./params/name');
const page = require('./params/page');
const specialization = require('./params/specialization');

const data = {
  name: 'Ни/*та',
  page: '0',
  specialization: 'Визажист',
};

const params = [specialization, name, page];

const paramsTests = dataPreparation(params, data);

module.exports = paramsTests;
