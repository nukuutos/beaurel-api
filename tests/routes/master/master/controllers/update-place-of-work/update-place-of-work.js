const User = require('../../../../../../models/user');
const master = require('../../../../../data/users/master');
const { getCity, checkIsCityCache, checkIsCityCacheDeleted } = require('./city-cache');

const city = 'Хабаровск';

const placeOfWork = {
  street: 'Тургенево',
  house: '13',
  building: '2',
  floor: '3',
  room: {
    type: 'salon',
    value: 'Хороший салон',
  },
};

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.save(master);
  });

  it('should successfully update place of work', async () => {
    await getCity.request();
    await checkIsCityCache();

    const response = await this.request().send({ ...placeOfWork, city });

    await checkIsCityCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const user = await User.findOne({}, { placeOfWork: 1, city: 1 });
    const { placeOfWork: placeOfWorkDb, city: cityDb } = user;

    expect(cityDb).toBe(city);
    expect(placeOfWorkDb).toStrictEqual(placeOfWork);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
