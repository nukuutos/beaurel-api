const { USERNAME_EXISTS } = require('../../../../config/errors/profile');
const User = require('../../../../models/user');
const master = require('../../../data/masters/master');
const master1 = require('../../../data/masters/master-1');

module.exports = function () {
  it('should fail, user with this username has already existed', async () => {
    const username = 'test';
    master1.username = username;
    await User.save(master1);

    const response = await this.request().send({
      username: username.toUpperCase(),
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(USERNAME_EXISTS);

    await User.deleteMany({});
  });

  it('should successfully update username', async () => {
    await User.save(master);

    const username = 'test';

    const response = await this.request().send({
      username,
    });

    const { statusCode } = response;

    expect(statusCode).toBe(200);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
