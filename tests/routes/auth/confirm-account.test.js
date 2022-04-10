const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');

const bodyFields = require('./body-fields/confirm-account');

const controller = require('./controllers/confirm-account/confirm-account');

const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/auth/sign-up/confirmation';

const config = { template, method: 'post' };

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testBodyFields(bodyFields).testController(controller);
});

after();
