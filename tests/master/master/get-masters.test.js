const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');

const queryParams = require('./query-params/get-masters');
const controller = require('./controllers/get-masters');

const master = require('../../data/masters/master');
const master1 = require('../../data/masters/master-1');
const master3 = require('../../data/masters/master-2');
const master2 = require('../../data/masters/master-3');
const { after, before } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/master';

const config = {
  template,
  method: 'get',
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.insertMany([master, master1, master2, master3]);
});

describe(`GET ${template}`, () => {
  request.testQueryParams(queryParams).testController(controller);
});

after();
