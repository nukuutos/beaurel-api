const app = require('../../app');

const ExtendedSupertest = require('../extended-supertest');

const controller = require('./controllers/refresh-token');

const User = require('../../models/user/user');
const master = require('../data/masters/master');
const { before, after } = require('../utils/endpoint-test-preparation');

const template = '/api/v1/auth/refresh-token';

const config = { template, method: 'post' };

const request = new ExtendedSupertest(app, config);

before(async () => {
  await User.save(master);
});

describe(`POST ${template}`, () => {
  request.testController(controller);
});

after();
