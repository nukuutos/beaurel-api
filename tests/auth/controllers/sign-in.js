const { INVALID_IDENTIFICATOR_OR_PASSWORD } = require('../../../config/errors/auth');

module.exports = function () {
  it('should successfully sign in with email', async () => {
    const response = await this.request()
      .send({ identificator: 'test@test.com', password: '123456' })
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('role');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('username');
  });

  it('should successfully sign in with phone 8', async () => {
    const response = await this.request()
      .send({ identificator: '89999999999', password: '123456' })
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('role');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('username');
  });

  it('should successfully sign in with phone +7', async () => {
    const response = await this.request()
      .send({ identificator: '+79999999999', password: '123456' })
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('role');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('username');
  });

  it('should successfully sign in with mongoId', async () => {
    const response = await this.request()
      .send({ identificator: '5eb849b81c2ccc21306ced34', password: '123456' })
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('role');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('username');
  });

  it('should successfully sign in with username', async () => {
    const response = await this.request()
      .send({ identificator: 'test', password: '123456' })
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('role');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('username');
  });

  it('should not find user with this email', async () => {
    const response = await this.request().send({
      identificator: 'invalid@test.com',
      password: '123456',
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_IDENTIFICATOR_OR_PASSWORD);
  });

  it('should not find user with this phone +7', async () => {
    const response = await this.request().send({
      identificator: '+79899999999',
      password: '123456',
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_IDENTIFICATOR_OR_PASSWORD);
  });

  it('should not find user with this phone 8', async () => {
    const response = await this.request().send({
      identificator: '89899999999',
      password: '123456',
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_IDENTIFICATOR_OR_PASSWORD);
  });

  it('should not find user with this username', async () => {
    const response = await this.request().send({
      identificator: 'testik',
      password: '123456',
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_IDENTIFICATOR_OR_PASSWORD);
  });

  it('should detect incorrect password', async () => {
    const response = await this.request().send({
      identificator: 'test@test.com',
      password: '1234567',
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_IDENTIFICATOR_OR_PASSWORD);
  });
};
