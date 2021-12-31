const User = require('../../../../models/user');
const master = require('../../../data/masters/master');

module.exports = function () {
  it('should successfully update profile without hacking field', async () => {
    const aboutText = 'new good about text';
    const firstName = 'Привает';
    const lastName = 'Сергей';

    const response = await this.request().send({
      firstName,
      lastName,
      aboutText,
      hackField: 'hacku',
    });

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const dbData = await User.findOne(
      { _id: master._id },
      { firstName: 1, lastName: 1, aboutText: 1, hackField: 1 }
    );

    expect(dbData).toHaveProperty('aboutText');
    expect(dbData).not.toHaveProperty('hackField');

    expect(dbData.aboutText).toBe(aboutText);
    expect(dbData.firstName).toBe(firstName);
    expect(dbData.lastName).toBe(lastName);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
