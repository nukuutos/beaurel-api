const Profile = require('../../logic/profile/profile');
const User = require('../../models/user');
const cronUnconfirmedAccounts = require('../data/masters/cron-unconfirmed-accounts');
const { before, after } = require('../utils/endpoint-test-preparation');

describe(`Cron delete unconfirmed accounts`, () => {
  before();

  it('should successfully delete unconfirmed accounts', async () => {
    await User.insertMany(cronUnconfirmedAccounts);

    await Profile.deleteUnconfirmedAccounts();

    const users = await User.find({});

    expect(users).toHaveLength(2);
  });

  after();
});
