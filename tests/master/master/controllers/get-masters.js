const { getCachedData } = require('../../../../utils/redis');

module.exports = function () {
  it('should successfully get masters', async () => {
    const query = { name: 'Те', page: 0, specialization: 'Визажист' };

    const response = await this.request().query(query);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { masters } = body;

    expect(masters.length).toBe(3);
  });

  it('should cache result', async () => {
    const [specialization, page] = ['Визажист', 0];

    const query = { name: '', page, specialization };

    const response = await this.request().query(query);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { masters } = body;

    expect(masters.length).toBe(4);

    const cachedData = await getCachedData('searchMasters', specialization + page);

    const parsedData = JSON.parse(cachedData);

    expect(parsedData.length).toBe(4);
  });
};
