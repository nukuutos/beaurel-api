const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');

const controller = require('./controllers/refresh-token/refresh-token');

const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/auth/refresh-token';

const config = { template, method: 'post' };

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testController(controller);
});

after();
