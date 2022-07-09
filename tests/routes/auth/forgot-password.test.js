const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');

const bodyFields = require('./body-fields/update-password');

const controller = require('./controllers/update-password/update-password');

const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/auth/password/';

const config = { template, method: 'put' };

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testBodyFields(bodyFields).testController(controller);
});

after();
