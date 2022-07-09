const { NO_APPOINTMENT, NO_REVIEW } = require('../../../../../../config/errors/review');
const Appointment = require('../../../../../../models/appointment');
const Review = require('../../../../../../models/review');
const User = require('../../../../../../models/user');
const { createAccessToken } = require('../../../../../../modules/express/send-token/create-token');
const master = require('../../../../../data/users/master');
const master1 = require('../../../../../data/users/master-1');
const reviewsData = require('../../../data/reviews-data');
const appointments = require('../../data/appointments');
const { getReviewsData, checkIsCache, checkIsCacheDeleted } = require('./utils');

const data = {
  value: '4',
  comment: 'красота значит, автор жжёт!',
};

module.exports = function () {
  beforeAll(async () => {
    await User.insertMany([master, master1]);
    await Appointment.insertMany(appointments);
  });

  beforeEach(async () => {
    await Review.deleteMany({});
  });

  it('should fail, appointment does not exist', async () => {
    const invalidAppointmentId = { appointmentId: '6072f6a7ba01a00418b97a19' };

    const response = await this.request(invalidAppointmentId).send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_APPOINTMENT);
  });

  it('should fail, review has not existed', async () => {
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_REVIEW);
  });

  it('should fail, update yourself review', async () => {
    const getAuthString = (user) => `Bearer ${createAccessToken(user)}`;
    const authString = getAuthString(master1);

    const response = await this.request().set('Authorization', authString);

    const { statusCode } = response;

    expect(statusCode).toBe(400);
  });

  it('should successfully update review', async () => {
    await Review.insertMany([
      ...reviewsData,
      {
        masterId: master._id,
        customerId: master1._id,
        appointmentId: appointments[0]._id,
      },
    ]);

    await getReviewsData.request().query({ page: 0 });
    await checkIsCache();

    const comment = 'красота';

    const response = await this.request().send({ ...data, comment });

    await checkIsCacheDeleted();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const review = await Review.findOne({ appointmentId: appointments[0]._id });

    expect(review.comment).toBe(comment);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
