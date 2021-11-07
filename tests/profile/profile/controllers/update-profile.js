const User = require('../../../../models/user/user');
const master = require('../../../data/masters/master');

module.exports = function () {
  it('should successfully update about text without hacking field', async () => {
    const aboutText = 'new good about text';

    const response = await this.request().send({
      aboutText,
      hackField: 'hacku',
    });

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const dbData = await User.findOne({ _id: master._id }, { aboutText: 1, hackField: 1 });

    expect(dbData).toHaveProperty('aboutText');
    expect(dbData).not.toHaveProperty('hackField');

    expect(dbData.aboutText).toBe(aboutText);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
