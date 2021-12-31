const { INVALID_EMAIL_OR_PASSWORD } = require('../../../config/errors/auth');

module.exports = function () {
  it('should successfully sign in', async () => {
    const response = await this.request()
      .send({ email: 'test@test.com', password: '123456' })
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('role');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('username');
  });

  it('should not find user with this email', async () => {
    const response = await this.request().send({ email: 'invalid@test.com', password: '123456' });

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_EMAIL_OR_PASSWORD);
  });

  it('should detect incorrect password', async () => {
    const response = await this.request().send({ email: 'test@test.com', password: '1234567' });

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_EMAIL_OR_PASSWORD);
  });
};
