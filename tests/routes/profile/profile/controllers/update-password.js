const { USER_EXISTS, INVALID_PASSWORD } = require('../../../../../config/errors/auth');
const { NO_USER } = require('../../../../../config/errors/profile');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');

const data = {
  password: '123456',
  newPassword: '1234567',
  newConfirmedPassword: '1234567',
};

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.save(master);
  });

  it('should successfully update password', async () => {
    const userData = await User.findOne({}, { password: 1 });

    const response = await this.request().send(data);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const newUserData = await User.findOne({}, { password: 1 });

    expect(userData.password).not.toBe(newUserData.password);
    expect(typeof newUserData.password).toBe('string');
  });

  it('should fail, user is not existed', async () => {
    await User.deleteMany({});

    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_USER);
  });

  it('should fail, incorrect current password', async () => {
    const failedData = { ...data, password: 'kfgljsdflskd' };
    const response = await this.request().send(failedData);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INVALID_PASSWORD);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
