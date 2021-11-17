const { CHANGE_STATUS } = require('../../../../../config/errors/appointment');
const { NO_APPOINTMENT } = require('../../../../../config/errors/review');
const Appointment = require('../../../../../models/appointment');
const appointments = require('../../../../data/appointments/appointments');
const { getBookingData, checkIsCache, checkIsCacheDeleted } = require('./utils');

const data = {
  status: 'confirmed',
};

module.exports = function () {
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
    await getBookingData.request();
    await checkIsCache();

    const appointmentId = { appointmentId: appointments[1]._id };
    const response = await this.request(appointmentId).send(data);

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const { status } = await Appointment.findOne(
      { _id: appointments[1]._id },
      { _id: 0, status: 1 }
    );

    expect(status).toBe('confirmed');
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
