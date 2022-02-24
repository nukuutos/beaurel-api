const Profile = require('../../logic/profile/profile');
const User = require('../../models/user');
const cronRestoreAttempts = require('../data/masters/cron-restore-attempts');
const { before, after } = require('../utils/endpoint-test-preparation');

describe(`Cron restore attempts to confirm account`, () => {
  before();

  it('should successfully restore attempts', async () => {
    await User.insertMany(cronRestoreAttempts);

    await Profile.restoreAttempts();

    const users = await User.find({
      'confirmation.attemptsCountLeft': 5,
      'confirmation.resendCountLeft': 5,
    });

    expect(users).toHaveLength(2);
  });

  after();
});
