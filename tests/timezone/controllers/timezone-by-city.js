const { getCachedData } = require("../../../utils/redis");

module.exports = function () {
  it("should successfully get timezone by city", async () => {
    const query = { city: ".У*", page: 0 };

    const response = await this.request().query(query);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { cities } = body;

    expect(cities.length).toBe(10);
  });

  it("should cache result", async () => {
    const query = { city: "", page: 0 };

    const response = await this.request().query(query);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { cities } = body;

    expect(cities.length).toBe(10);

    const cachedData = await getCachedData("searchTimezone", "0");

    const parsedData = JSON.parse(cachedData);

    expect(parsedData.length).toBe(10);
  });
};
