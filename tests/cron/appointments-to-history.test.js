const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const Appointment = require('../../logic/profile/appointment/appointment');
const appointmentsCron = require('../data/appointments/appointments-cron');
const { before, after } = require('../utils/endpoint-test-preparation');

describe(`Cron update appointments to history status`, () => {
  before();

  it('should successfully update appointments to history status', async () => {
    await Appointment.insertMany(appointmentsCron);

    await Appointment.toHistory();

    const appointments = await Appointment.find({ status: 'history' });

    expect(appointments).toHaveLength(3);
  });

  after();
});
