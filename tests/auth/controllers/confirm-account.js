const cloneDeep = require('lodash.clonedeep');
const {
  INVALID_PHONE_NUMBER,
  INVALID_VERIFICATION_CODE,
  ATTEMPTS_COUNT_LEFT,
  TIME_IS_OUT,
} = require('../../../config/errors/auth');
const User = require('../../../models/user');
const master = require('../../data/masters/master');

const data = {
  phone: '+79999999999',
  code: master.confirmation.verificationCode,
};

module.exports = function () {
  it('should successfully confirm account', async () => {
    await User.save(master);

    const response = await this.request().send(data);
    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('role');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('username');

    const user = await User.findOne({}, { 'confirmation.isConfirmed': 1 });

    expect(user.confirmation.isConfirmed).toBeTruthy();

    await User.deleteMany({});
  });

  it('should fail, invalid phone number', async () => {
    const response = await this.request().send({ ...data, phone: '+79999999989' });
    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_PHONE_NUMBER);
  });

  it('should fail, time is out', async () => {
    const accountWithExpiredCode = cloneDeep(master);
    accountWithExpiredCode.confirmation.lastSendAt = new Date('12-15-2021');

    await User.save(accountWithExpiredCode);

    const response = await this.request().send(data);
    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(TIME_IS_OUT);

    await User.deleteMany({});
  });

  it('should fail, invalid verification code', async () => {
    await User.save(master);

    const response = await this.request().send({ ...data, code: 'CCCC' });
    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INVALID_VERIFICATION_CODE);

    const user = await User.findOne({}, { 'confirmation.attemptsCountLeft': 1 });

    expect(user.confirmation.attemptsCountLeft).toBe(4);

    await User.deleteMany({});
  });

  it('should fail, attempts count is 0', async () => {
    await User.save(master);

    await this.request().send({ ...data, code: 'CCCC' });
    await this.request().send({ ...data, code: 'CCCC' });
    await this.request().send({ ...data, code: 'CCCC' });
    await this.request().send({ ...data, code: 'CCCC' });
    await this.request().send({ ...data, code: 'CCCC' });

    const response = await this.request().send({ ...data, code: 'CCCC' });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(ATTEMPTS_COUNT_LEFT);

    await User.deleteMany({});
  });
};
