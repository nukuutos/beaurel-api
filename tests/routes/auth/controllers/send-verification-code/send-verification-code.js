const { ATTEMPTS_COUNT_LEFT } = require('../../../../../config/errors/auth');
const User = require('../../../../../models/user');
const repeatRequest = require('../../../../utils/repeat-request');
const checkData = require('./check-data');
const { confirmedMaster } = require('./data-to-db');
const { validData, invalidData } = require('./data-to-send');

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.save(confirmedMaster);
  });

  it('should successfully resend code', async () => {
    const response = await this.request().send(validData);
    const { statusCode } = response;
    expect(statusCode).toBe(200);
  });

  it('should false success, invalid phone number', async () => {
    const response = await this.request().send(invalidData);
    const { statusCode } = response;
    expect(statusCode).toBe(200);
  });

  it('should fail, attempts count is 0', async () => {
    await repeatRequest(() => this.request().send(validData), 5);

    const response = await this.request().send(validData);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(ATTEMPTS_COUNT_LEFT);

    await checkData();
  });
};
