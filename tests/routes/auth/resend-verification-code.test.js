const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');

const bodyFields = require('./body-fields/resend-verification-code');

const controller = require('./controllers/resend-verification-code/resend-verification-code');

const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/auth/sign-up/code';

const config = { template, method: 'post' };

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testBodyFields(bodyFields).testController(controller);
});

after();
