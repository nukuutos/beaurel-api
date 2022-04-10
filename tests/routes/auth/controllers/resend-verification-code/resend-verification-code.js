const {
  INVALID_PHONE_NUMBER,
  ATTEMPTS_COUNT_LEFT,
  ACCOUNT_HAS_CONFIRMED,
} = require('../../../../../config/errors/auth');
const User = require('../../../../../models/user');
const repeatRequest = require('../../../../utils/repeat-request');
const checkData = require('./check-data');
const { confirmedMaster, master } = require('./data-to-db');
const { invalidData, validData } = require('./data-to-send');

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should successfully resend code', async () => {
    await User.save(master);

    const response = await this.request().send(validData);
    const { statusCode } = response;

    expect(statusCode).toBe(200);
  });

  it('should fail, invalid phone number', async () => {
    await User.save(master);

    const response = await this.request().send(invalidData);
    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_PHONE_NUMBER);
  });

  it('should fail, account has already confirmed', async () => {
    await User.save(confirmedMaster);

    const response = await this.request().send(validData);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(ACCOUNT_HAS_CONFIRMED);
  });

  it('should fail, attempts count is 0', async () => {
    await User.save(master);

    await repeatRequest(() => this.request().send(validData), 5);

    const response = await this.request().send(validData);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(ATTEMPTS_COUNT_LEFT);

    await checkData();
  });
};
