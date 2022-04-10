const dataPreparation = require('../../../../utils/data-preparation');
const name = require('./params/name');
const page = require('./params/page');
const city = require('./params/city');
const specialization = require('./params/specialization');

const data = {
  name: 'Ни/*та',
  page: '0',
  specialization: 'Визажист',
  city: 'Владивосток',
};

const params = [specialization, name, page, city];

const paramsTests = dataPreparation(params, data);

module.exports = paramsTests;
