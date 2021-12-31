const { USER_EXISTS } = require('../../../config/errors/auth');

const data = {
  email: 'test1@test.com',
  password: '123456',
  confPassword: '123456',
  firstName: 'Тест',
  lastName: 'Тест',
};

module.exports = function () {
  it('should successfully sign up', async () => {
    const response = await this.request()
      .send(data)
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(201);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('role');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('username');
  });

  it('should fail, find user with this email', async () => {
    const response = await this.request().send({
      ...data,
      email: 'test@test.com',
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(USER_EXISTS);
  });
};
