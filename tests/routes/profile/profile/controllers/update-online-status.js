const dayjs = require('dayjs');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.save(master);
  });

  it('should update wasOnline', async () => {
    const response = await this.request().send();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const user = await User.findOne({}, { wasOnline: 1 });

    const now = dayjs();

    const difference = now.diff(user.wasOnline, 'm');

    expect(difference).toBeLessThan(2);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
