const cloneDeep = require('lodash.clonedeep');
const dataPreparation = require('../../../../utils/data-preparation');
const subOrder = require('./fields/sub-order');
const order = require('./fields/order');
const serviceId = require('./fields/service-id');

const serviceIdForTest = cloneDeep(serviceId);
const orderForTest = cloneDeep(order);
const subOrderForTest = cloneDeep(subOrder);

serviceIdForTest.name = 'newOrder.id';
orderForTest.name = 'newOrder.order';
subOrderForTest.name = 'newOrder.subOrder';

const data = {
  newOrder: [
    {
      id: '6121fc9f8fce2120cc841b6c',
      order: 0,
      subOrder: 0,
    },
  ],
};

const fields = [serviceIdForTest, orderForTest, subOrderForTest];

const tests = dataPreparation(fields, data);

module.exports = tests;
