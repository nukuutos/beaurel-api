const dayjs = require('dayjs');
const Appointment = require('../../../../models/appointment');

module.exports = function () {
  it('should successfully get sorted appointments', async () => {
    const response = await this.request().query({ category: 'confirmed', page: 0 });

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { appointments } = body;

    const appointmentsDates = Object.keys(appointments).map((date) => dayjs(date, 'DD-MM-YYYY'));

    expect(appointmentsDates).toHaveLength(3);

    const isSorted = appointmentsDates.every((currentDate, index) => {
      if (index === 0) return true;

      const prevDate = appointmentsDates[index - 1];
      const difference = currentDate.diff(prevDate);

      if (difference > 0) return true;
      return false;
    });

    expect(isSorted).toBeTruthy();

    const appointmentsDB = await Appointment.find({ status: 'confirmed' });

    const isViewed = appointmentsDB.every(({ isViewed }) => {
      const { master, customer } = isViewed;
      if (master && !customer) return true;
      return false;
    });

    expect(isViewed).toBeTruthy();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request()
      .query({ category: 'history', page: 0 })
      .set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
