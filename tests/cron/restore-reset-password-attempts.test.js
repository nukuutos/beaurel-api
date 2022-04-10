const Profile = require('../../logic/profile/profile');
const User = require('../../models/user');
const cronRestoreAttempts = require('./data/user');
const { before, after } = require('../utils/endpoint-test-preparation');

describe(`Cron restore attempts to confirm account`, () => {
  before();

  it('should successfully restore attempts', async () => {
    await User.insertMany(cronRestoreAttempts);

    await Profile.restoreResetPasswordAttempts();

    const users = await User.find({
      'resetPassword.attemptsCountLeft': 5,
    });

    expect(users).toHaveLength(2);
  });

  after();
});
