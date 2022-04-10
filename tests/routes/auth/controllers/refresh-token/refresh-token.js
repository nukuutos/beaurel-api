const { INVALID_TOKEN, NO_REFRESH_TOKEN } = require('../../../../../config/errors/auth');
const User = require('../../../../../models/user');
const { createRefreshToken } = require('../../../../../modules/express/send-token/create-token');

const master = require('../../../../data/users/master');
const checkAuthData = require('./check-data');

module.exports = function () {
  beforeAll(async () => {
    await User.save(master);
  });

  it('should successfully refresh token', async () => {
    const refreshToken = createRefreshToken(master);

    const response = await this.request()
      .set('Cookie', `refreshToken=${refreshToken}`)
      .expect('set-cookie', /^refreshToken=/);

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);
    checkAuthData(body);
  });

  // this check provides by validator
  it('should not find refresh token', async () => {
    const response = await this.request();

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(NO_REFRESH_TOKEN);
  });

  it('should detect invalid token', async () => {
    const response = await this.request().set('Cookie', `refreshToken=invalidToken`);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(INVALID_TOKEN);
  });
};
