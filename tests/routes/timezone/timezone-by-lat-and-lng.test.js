const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');

const queryParams = require('./query-params/timezone-by-lat-and-lng');

const controller = require('./controllers/timezone-by-lat-and-lng');
const { before, after } = require('../../utils/endpoint-test-preparation');

const config = { template: '/api/v1/timezone', method: 'get' };

const request = new ExtendedSupertest(app, config);

before();

describe('GET /timezone?lat&lng', () => {
  request.testQueryParams(queryParams).testController(controller);
});

after();
