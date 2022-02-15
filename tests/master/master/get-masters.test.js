const app = require('../../../app');
const User = require('../../../models/user');

const ExtendedSupertest = require('../../extended-supertest');

const queryParams = require('./query-params/get-masters');
const controller = require('./controllers/get-masters');

const { after, before } = require('../../utils/endpoint-test-preparation');
const searchMasters = require('../../data/masters/search-masters');

const template = '/api/v1/master';

const config = {
  template,
  method: 'get',
};

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.insertMany(searchMasters);
});

describe(`GET ${template}`, () => {
  request.testQueryParams(queryParams).testController(controller);
});

after();
