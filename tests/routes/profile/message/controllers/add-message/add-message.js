const { matchersWithOptions } = require('jest-json-schema');
const { NO_USER } = require('../../../../../../config/errors/message');
const Message = require('../../../../../../models/message');
const User = require('../../../../../../models/user');
const master = require('../../../../../data/users/master');
const master1 = require('../../../../../data/users/master-1');
const checkData = require('./check-data');

expect.extend(matchersWithOptions({ verbose: true }));

const data = {
  message: 'hi, fjsdlkfj',
};

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await User.save(master);
  });

  it('should fail, no recipient', async () => {
    const response = await this.request().send(data);

    const { statusCode, body } = response;

    expect(statusCode).toBe(400);

    const { message } = body;

    expect(message).toBe(NO_USER);
  });

  it('should successfully save message', async () => {
    await User.save(master1);

    const response = await this.request().send(data);

    const { statusCode } = response;

    expect(statusCode).toBe(201);

    await checkData(data);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request()
      .query({ category: 'history' })
      .set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
