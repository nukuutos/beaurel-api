const User = require('../../../../../../models/user');
const { getCachedData } = require('../../../../../../utils/redis');
const searchMasters = require('./search-masters');

module.exports = function () {
  beforeAll(async () => {
    await User.insertMany(searchMasters);
  });

  it('should successfully get masters', async () => {
    const query = { name: 'Те', page: 0, specialization: 'Визажист', city: 'Владивосток' };

    const response = await this.request().query(query);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { masters } = body;

    expect(masters).toHaveLength(1);
    expect(masters[0]).toHaveProperty('isAvatar');
  });

  it('should cache result', async () => {
    const [city, specialization, page] = ['Владивосток', 'Визажист', 0];

    const query = { name: '', page, specialization, city: 'Владивосток' };

    const response = await this.request().query(query);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { masters } = body;

    expect(masters).toHaveLength(2);

    const cachedData = await getCachedData('searchMasters', city + specialization + page);

    const parsedData = JSON.parse(cachedData);

    expect(parsedData).toHaveLength(2);
  });
};
