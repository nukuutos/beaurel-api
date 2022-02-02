const dayjs = require('dayjs');

module.exports = function () {
  it('should successfully get sorted appointments', async () => {
    const response = await this.request().query({ category: 'history' });

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { appointments } = body;

    const appointmentsDates = Object.keys(appointments).map((date) => dayjs(date, 'DD-MM-YYYY'));

    expect(appointmentsDates).toHaveLength(3);

    const isSorted = appointmentsDates.every((currrentDate, index) => {
      if (index === 0) return true;

      const prevDate = appointmentsDates[index - 1];
      const difference = currrentDate.diff(prevDate);

      if (difference > 0) return true;
      return false;
    });

    expect(isSorted).toBeTruthy();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request()
      .query({ category: 'history' })
      .set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
