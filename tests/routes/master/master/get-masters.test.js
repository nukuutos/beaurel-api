const app = require('../../../../app');
const ExtendedSupertest = require('../../../extended-supertest');

const queryParams = require('./query-params/get-masters');
const controller = require('./controllers/get-masters/get-masters');

const { after, before } = require('../../../utils/endpoint-test-preparation');

const template = '/api/v1/master';

const config = {
  template,
  method: 'get',
};

const request = new ExtendedSupertest(app, config);

before();

describe(`GET ${template}`, () => {
  request.testQueryParams(queryParams).testController(controller);
});

after();
