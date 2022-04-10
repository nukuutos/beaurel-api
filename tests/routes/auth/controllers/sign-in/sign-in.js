const { INVALID_IDENTIFICATOR_OR_PASSWORD } = require('../../../../../config/errors/auth');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const checkData = require('./check-data');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
  });

  it('should successfully sign in with phone 8', async () => {
    const response = await this.request()
      .send({ identificator: '89999999999', password: '123456' })
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    checkData(body);
  });

  it('should successfully sign in with phone +7', async () => {
    const response = await this.request()
      .send({ identificator: '+79999999999', password: '123456' })
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    checkData(body);
  });

  it('should successfully sign in with mongoId', async () => {
    const response = await this.request()
      .send({ identificator: '5eb849b81c2ccc21306ced34', password: '123456' })
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    checkData(body);
  });

  it('should successfully sign in with username', async () => {
    const response = await this.request()
      .send({ identificator: 'test', password: '123456' })
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    checkData(body);
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
      identificator: '+79999999999',
      password: '1234567',
    });

    const { statusCode, body } = response;

    expect(statusCode).toBe(404);

    const { message } = body;

    expect(message).toBe(INVALID_IDENTIFICATOR_OR_PASSWORD);
  });
};
