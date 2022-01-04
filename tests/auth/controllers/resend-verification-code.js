const cloneDeep = require('lodash.clonedeep');
const {
  INVALID_PHONE_NUMBER,
  ATTEMPTS_COUNT_LEFT,
  ACCOUNT_HAS_CONFIRMED,
} = require('../../../config/errors/auth');
const User = require('../../../models/user');
const master = require('../../data/masters/master');

const data = {
  phone: '+79999999999',
};

module.exports = function () {
  it('should successfully resend code', async () => {
    await User.save(master);

    const response = await this.request().send(data);
    const { statusCode } = response;

    expect(statusCode).toBe(200);

    await User.deleteMany({});
  });

  it('should fail, invalid phone number', async () => {
    await User.save(master);

    const response = await this.request().send({ ...data, phone: '+79999999989' });
    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_PHONE_NUMBER);
    await User.deleteMany({});
  });

  it('should fail, account has already confirmed', async () => {
    const confirmedMaster = cloneDeep(master);
    confirmedMaster.confirmation.isConfirmed = true;

    await User.save(confirmedMaster);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(ACCOUNT_HAS_CONFIRMED);
    await User.deleteMany({});
  });

  it('should fail, attempts count is 0', async () => {
    await User.save(master);

    await this.request().send(data);
    await this.request().send(data);
    await this.request().send(data);
    await this.request().send(data);
    await this.request().send(data);

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(ATTEMPTS_COUNT_LEFT);

    const user = await User.findOne(
      {},
      { 'confirmation.lastSendAt': 1, 'confirmation.verificationCode': 1 }
    );

    expect(user.confirmation.lastSendAt).not.toBeNull();
    expect(user.confirmation.verificationCode).not.toBe(master.confirmation.verificationCode);

    await User.deleteMany({});
  });
};
