const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const { getCity, checkIsCityCache, checkIsCityCacheDeleted } = require('./utils/city-cache');

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.save(master);
  });

  it('should successfully update profile without hacking field', async () => {
    const aboutText = 'new good about text';
    const firstName = 'Привает';
    const lastName = 'Сергей';
    const city = 'Хабаровск';

    await getCity.request();
    await checkIsCityCache();

    const response = await this.request().send({
      firstName,
      lastName,
      aboutText,
      city,
      hackField: 'hacku',
    });

    await checkIsCityCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const dbData = await User.findOne(
      { _id: master._id },
      { firstName: 1, lastName: 1, aboutText: 1, city: 1, hackField: 1 }
    );

    expect(dbData).toHaveProperty('aboutText');
    expect(dbData).not.toHaveProperty('hackField');

    expect(dbData.aboutText).toBe(aboutText);
    expect(dbData.firstName).toBe(firstName);
    expect(dbData.lastName).toBe(lastName);
    expect(dbData.city).toBe(city);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
