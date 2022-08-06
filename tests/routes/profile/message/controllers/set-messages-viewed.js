const { matchersWithOptions } = require('jest-json-schema');
const Message = require('../../../../../models/message');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const master1 = require('../../../../data/users/master-1');
const messagesData = require('./utils/data/messages');

expect.extend(matchersWithOptions({ verbose: true }));

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await User.insertMany([master, master1]);
    await Message.insertMany(messagesData);
  });

  it('should successfully set messages to viewed', async () => {
    const response = await this.request();

    const { statusCode } = response;

    expect(statusCode).toBe(200);

    const messages = await Message.find({ isUnread: false });

    expect(messages).toHaveLength(14);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request()
      .query({ category: 'history' })
      .set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
