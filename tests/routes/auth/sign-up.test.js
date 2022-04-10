const app = require('../../../app');

const ExtendedSupertest = require('../../extended-supertest');
const bodyFields = require('./body-fields/sign-up');
const controller = require('./controllers/sign-up/sign-up');

const { before, after } = require('../../utils/endpoint-test-preparation');

const template = '/api/v1/auth/sign-up';

const config = { template, method: 'post' };

const request = new ExtendedSupertest(app, config);

before();

describe(`POST ${template}`, () => {
  request.testBodyFields(bodyFields).testController(controller);
});

after();
