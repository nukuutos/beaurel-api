const dataPreparation = require('../../../utils/data-preparation');
const page = require('./params/page');

const data = {
  page: '0',
};

const params = [page];

const paramsTests = dataPreparation(params, data);

module.exports = paramsTests;
