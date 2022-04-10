const dayjs = require('dayjs');
const { CHANGE_STATUS } = require('../../../../../../config/errors/appointment');
const { NO_APPOINTMENT } = require('../../../../../../config/errors/review');
const Appointment = require('../../../../../../models/appointment');
const Timetable = require('../../../../../../models/timetable');
const User = require('../../../../../../models/user');
const appointments = require('../../data/appointments');
const master = require('../../../../../data/users/master');
const autoTimetable = require('../../../data/auto-timetable');
const { checkIsCache, getBookedAppointments, checkIsCacheDeleted } = require('./utils');

const data = {
  status: 'cancelled',
};

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
    await Appointment.insertMany(appointments);
    await Timetable.save(autoTimetable);
  });

  it('should fail, appointment does not exist', async () => {
    const invalidAppointmentId = { appointmentId: '6072f6a7ba01a11418b97a19' };

    const response = await this.request(invalidAppointmentId).send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_APPOINTMENT);
  });

  it('should fail, invalid status for changing', async () => {
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(CHANGE_STATUS);
  });

  it('should successfully change status', async () => {
    await getBookedAppointments
      .request()
      .query({ date: dayjs().startOf('day').utc(true).format() });

    await checkIsCache();

    const appointmentId = { appointmentId: appointments[1]._id };
    const response = await this.request(appointmentId).send(data);

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const { status, isViewed, history } = await Appointment.findOne(
      { _id: appointments[1]._id },
      { _id: 0, status: 1, isViewed: 1, history: 1 }
    );

    expect(status).toBe('cancelled');

    const { master, customer } = isViewed;

    expect(master).toBeFalsy();
    expect(customer).toBeTruthy();

    expect(history).toHaveLength(2);

    const { user, status: recordStatus } = history[1];

    expect(user).toBe('customer');
    expect(recordStatus).toBe('cancelled');
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
