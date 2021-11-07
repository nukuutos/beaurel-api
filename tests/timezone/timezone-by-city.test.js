const app = require('../../app');

const { after, before } = require('../utils/endpoint-test-preparation');

const ExtendedSupertest = require('../extended-supertest');

const controller = require('./controllers/timezone-by-city');
const queryParams = require('./query-params/timezone-by-city');

const config = { template: '/api/v1/timezone/city', method: 'get' };

const request = new ExtendedSupertest(app, config);

before();

describe('GET /timezone?city&page', () => {
  request.testQueryParams(queryParams).testController(controller);
});

after();
