const dataPreparation = require('../../../utils/data-preparation');
const category = require('./params/category');
const page = require('./params/page');

const data = {
  category: 'confirmed',
  page: '0',
};

const params = [category, page];

const paramsTests = dataPreparation(params, data);

module.exports = paramsTests;
