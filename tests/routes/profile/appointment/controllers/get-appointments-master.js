const dayjs = require('dayjs');
const Appointment = require('../../../../../models/appointment');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const appointments = require('./utils/appointments-data');
const { getIsViewedMaster, getIsSorted } = require('./utils/utils');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await Appointment.insertMany(appointments);
  });

  it('should successfully get sorted appointments', async () => {
    const response = await this.request().query({ category: 'confirmed', page: 0 });

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    const { appointments } = body;

    const { status } = appointments['18-04-2021'][0];

    expect(status.status).toBe('confirmed');
    expect(status.user).toBe('master');

    const appointmentsDates = Object.keys(appointments).map((date) => dayjs(date, 'DD-MM-YYYY'));

    expect(appointmentsDates).toHaveLength(3);

    const isSorted = getIsSorted(appointmentsDates);

    expect(isSorted).toBeTruthy();

    const appointmentsDB = await Appointment.find({ status: 'confirmed' }, { history: 0 });

    const isViewed = getIsViewedMaster(appointmentsDB);

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
