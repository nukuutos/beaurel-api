const dataPreparation = require('../../../utils/data-preparation');
const subOrder = require('./fields/sub-order');
const order = require('./fields/order');
const serviceId = require('./fields/service-id');

//  it should be - { newOrder: [ { id, order, subOrder } ] }
const data = {
  id: '6121fc9f8fce2120cc841b6c',
  order: 0,
  subOrder: 0,
};

const fields = [serviceId, order, subOrder];

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

const wrappedTests = wrapData(fieldsTests, 'newOrder');

module.exports = wrappedTests;
