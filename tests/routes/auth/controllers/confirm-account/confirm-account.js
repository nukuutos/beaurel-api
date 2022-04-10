const {
  INVALID_PHONE_NUMBER,
  INVALID_VERIFICATION_CODE,
  ATTEMPTS_COUNT_LEFT,
  TIME_IS_OUT,
} = require('../../../../../config/errors/auth');
const User = require('../../../../../models/user');
const repeatRequest = require('../../../../utils/repeat-request');
const { checkAuthData, checkConfirmedMaster, checkMasterAfterAttempt } = require('./check-data');
const { masterWithExpiredCode, master } = require('./data-to-db');
const { validData, dataWithInvalidPhone, dataWithInvalidCode } = require('./data-to-send');

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should successfully confirm account', async () => {
    await User.save(master);

    const response = await this.request().send(validData);
    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    checkAuthData(body);
    await checkConfirmedMaster();
  });

  it('should fail, invalid phone number', async () => {
    const response = await this.request().send(dataWithInvalidPhone);
    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_PHONE_NUMBER);
  });

  it('should fail, time is out', async () => {
    await User.save(masterWithExpiredCode);

    const response = await this.request().send(validData);
    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TIME_IS_OUT);
  });

  it('should fail, invalid verification code', async () => {
    await User.save(master);

    const response = await this.request().send(dataWithInvalidCode);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INVALID_VERIFICATION_CODE);

    await checkMasterAfterAttempt();
  });

  it('should fail, attempts count is 0', async () => {
    await User.save(master);

    await repeatRequest(() => this.request().send(dataWithInvalidCode), 5);

    const response = await this.request().send(dataWithInvalidCode);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(ATTEMPTS_COUNT_LEFT);
  });
};
