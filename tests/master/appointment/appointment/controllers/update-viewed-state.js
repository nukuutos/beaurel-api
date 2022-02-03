const Appointment = require('../../../../../models/appointment');
const User = require('../../../../../models/user');
const { createAccessToken } = require('../../../../../modules/express/send-token/create-token');
const appointment = require('../../../../data/appointments/appointment-for-viewed-state');
const master = require('../../../../data/masters/master');
const master1 = require('../../../../data/masters/master-1');

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await Appointment.deleteMany({});

    await Appointment.save(appointment);
  });

  it('should successfully update viewed state of master', async () => {
    await User.save(master);

    const data = { role: 'master' };

    const response = await this.request().send(data);

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const appointmentData = await Appointment.findOne({}, { _id: 0, 'isViewed.master': 1 });

    expect(appointmentData.isViewed.master).toBeTruthy();
  });

  it('should successfully update viewed state of customer', async () => {
    await User.save(master1);
    const data = { role: 'customer' };
    const authString = `Bearer ${createAccessToken(master1)}`;

    const response = await this.request().set('Authorization', authString).send(data);

    const { statusCode } = response;

    expect(statusCode).toBe(200);
    // wait for update on server because server does not wait it
    const appointmentData = await Appointment.findOne({}, { _id: 0, 'isViewed.customer': 1 });
    expect(appointmentData.isViewed.customer).toBeTruthy();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
