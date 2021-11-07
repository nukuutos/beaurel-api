const supertest = require('supertest');

const { createAccessToken } = require('../modules/express/send-token/create-token');

class ExtendedSupertest {
  constructor(app, { template, routeParams, method = 'post', user = null }) {
    this.agent = supertest.agent(app);
    this.template = template;
    this.routeParams = routeParams;
    this.method = method;
    this.user = user;
  }

  getAuthString(user) {
    if (user) {
      return `Bearer ${createAccessToken(user)}`;
    }
    return null;
  }

  getUrl(customRouteParams) {
    const { routeParams, template } = this;

    const urlRouteParams = { ...routeParams, ...customRouteParams };

    const templateArray = template.split('/');

    for (const param in urlRouteParams) {
      const paramIndex = templateArray.indexOf(`:${param}`);
      if (paramIndex === -1) throw new Error(`:${param} - no route param in template!`);
      templateArray[paramIndex] = urlRouteParams[param];
    }

    return encodeURI(templateArray.join('/'));
  }

  request(customRouteParams = {}) {
    const { agent, method, user } = this;

    const authString = this.getAuthString(user);
    const url = this.getUrl(customRouteParams);

    return agent[method](url).set('Authorization', authString);
  }

  testController(controller) {
    describe('Controller', () => {
      controller.call(this);
    });

    return this;
  }

  testBodyFields(testObjects) {
    const getResponse = async (data) => await this.request().send(data);

    describe('Body Fields', () => {
      this.testFactory(testObjects, getResponse);
    });

    return this;
  }

  testQueryParams(testObjects) {
    const getResponse = async (data) => await this.request().query(data);

    describe('Query Params', () => {
      this.testFactory(testObjects, getResponse);
    });

    return this;
  }

  testRouteParams(testObjects) {
    const getResponse = async (routeParams) => await this.request(routeParams);

    describe('Route Params', () => {
      this.testFactory(testObjects, getResponse);
    });

    return this;
  }

  testFactory(testObjects, getResponse) {
    for (const testObject of testObjects) {
      const { name, tests } = testObject;

      // eslint-disable-next-line jest/valid-title
      describe(name, () => {
        for (const test of tests) {
          const { message: testName, data, error, status } = test;

          // eslint-disable-next-line jest/valid-title
          it(testName, async () => {
            const response = await getResponse(data);

            const { statusCode, body } = response;

            expect(statusCode).toBe(status || 400);

            const { message } = body;

            expect(message).toBe(error);
          });
        }
      });
    }
  }
}

module.exports = ExtendedSupertest;
