const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.save(master);
  });

  it('should successfully get wasOnline', async () => {
    const response = await this.request().send();

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { wasOnline } = body;

    expect(new Date(wasOnline).toString()).toBe(master.wasOnline.toString());
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
