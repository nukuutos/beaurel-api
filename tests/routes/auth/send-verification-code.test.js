const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');

const bodyFields = require('./body-fields/send-verification-code');

const controller = require('./controllers/send-verification-code/send-verification-code');

const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/auth/password/code';

const config = { template, method: 'post' };

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testBodyFields(bodyFields).testController(controller);
});

after();
