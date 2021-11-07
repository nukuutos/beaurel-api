const { NO_APPOINTMENT, NO_REVIEW } = require('../../../../../config/errors/review');
const Review = require('../../../../../models/review');
const { createAccessToken } = require('../../../../../modules/express/send-token/create-token');
const master1 = require('../../../../data/masters/master-1');

const data = {
  value: '4',
  comment: 'красота значит, автор жжёт!',
};

module.exports = function () {
  it('should fail, appointment does not exist', async () => {
    const invalidAppointmentId = { appointmentId: '6072f6a7ba01a00418b97a19' };

    const response = await this.request(invalidAppointmentId).send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(NO_APPOINTMENT);
  });

  it('should fail, review has already existed', async () => {
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(NO_REVIEW);

    Review.deleteMany({});
  });

  it('should fail, update yourself review', async () => {
    const getAuthString = (user) => `Bearer ${createAccessToken(user)}`;
    const authString = getAuthString(master1);

    const response = await this.request().set('Authorization', authString);

    const { statusCode } = response;

    expect(statusCode).toBe(404);
  });

  it('should successfully update review', async () => {
    await this.request().send(data);

    const comment = 'красота';

    const response = await this.request().send({ ...data, comment });

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const review = Review.findOne({});

    expect(review.comment).toBe(comment);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request().set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
