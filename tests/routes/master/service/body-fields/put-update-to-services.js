const cloneDeep = require('lodash.clonedeep');
const dataPreparation = require('../../../../utils/data-preparation');
const serviceId = require('./fields/service-id');
const duration = require('./fields/duration');

const serviceIdForTest = cloneDeep(serviceId);
const durationForTest = cloneDeep(duration);

serviceIdForTest.name = 'services.id';
durationForTest.name = 'services.duration';

const data = {
  services: [
    {
      id: '6121fc9f8fce2120cc841b6c',
      duration: 90,
    },
  ],
};

const fields = [serviceIdForTest, durationForTest];

const wrappedTests = dataPreparation(fields, data);

module.exports = wrappedTests;
