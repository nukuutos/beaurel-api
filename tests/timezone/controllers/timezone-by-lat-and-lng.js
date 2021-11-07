// {
//   "city": "Владивосток",
//   "timezone": "Asia/Vladivostok",
//   "latitude": 43.13001467,
//   "longitude": 131.9100256
// },

module.exports = function () {
  it("should successfully get timezone and city", async () => {
    const query = { lat: 43.1, lng: 131 };

    const response = await this.request().query(query);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(body).toHaveProperty("city");
    expect(body).toHaveProperty("timezone");

    const { city, timezone } = body;

    expect(city).toBe("Владивосток");
    expect(timezone).toBe("Asia/Vladivostok");
  });
};
