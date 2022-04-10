const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const Appointment = require('../../../logic/profile/appointment/appointment');
const appointmentsCron = require('./appointments-cron');
const { before, after } = require('../../utils/endpoint-test-preparation');

describe(`Cron update appointments to history status`, () => {
  before();

  it('should successfully update appointments to history status', async () => {
    await Appointment.insertMany(appointmentsCron);

    await Appointment.toHistory();

    const historyAppointments = await Appointment.find({ status: 'history' });
    const unansweredAppointments = await Appointment.find({ status: 'unanswered' });

    expect(historyAppointments).toHaveLength(1);
    expect(unansweredAppointments).toHaveLength(2);

    historyAppointments.forEach((appointment) => {
      expect(appointment.history[1].user).toBe('server');
      expect(appointment.history[1].status).toBe('history');
    });

    unansweredAppointments.forEach((appointment) => {
      expect(appointment.history[1].user).toBe('server');
      expect(appointment.history[1].status).toBe('unanswered');
    });
  });

  after();
});
