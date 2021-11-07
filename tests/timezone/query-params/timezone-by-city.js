const dataPreparation = require('../../utils/data-preparation');
const city = require('./params/city');
const page = require('./params/page');

const data = {
  city: 'Ус/c',
  page: '0',
};

const params = [city, page];

const paramsTests = dataPreparation(params, data);

module.exports = paramsTests;
