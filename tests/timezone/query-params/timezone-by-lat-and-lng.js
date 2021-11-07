const dataPreparation = require('../../utils/data-preparation');

const lat = require('./params/lat');
const lng = require('./params/lng');

const data = {
  lat: '1203.02312',
  lng: '21312.102',
};

const params = [lat, lng];

const paramsTests = dataPreparation(params, data);

module.exports = paramsTests;
