const dataPreparation = require('../../../utils/data-preparation');
const serviceId = require('./fields/service-id');
const duration = require('./fields/duration');

//  it should be - { services: [ { id, duration } ] }
const data = {
  id: '6121fc9f8fce2120cc841b6c',
  duration: 90,
};

const fields = [serviceId, duration];

const fieldsTests = dataPreparation(fields, data);

const wrapData = (fieldsData, arrayName) => {
  const wrappedData = fieldsData.map((testData) => {
    const { tests } = testData;

    const testsWithWrapper = tests.map((test) => {
      const { data } = test;

      const newData = {};
      newData[arrayName] = [data];

      return { ...test, data: newData };
    });

    return { ...testData, tests: testsWithWrapper };
  });

  return wrappedData;
};

const wrappedTests = wrapData(fieldsTests, 'services');

module.exports = wrappedTests;
