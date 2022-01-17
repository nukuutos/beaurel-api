const { matchersWithOptions } = require('jest-json-schema');
const Message = require('../../../../models/message');
const User = require('../../../../models/user');
const master = require('../../../data/masters/master');
const master1 = require('../../../data/masters/master-1');
const messagesData = require('../../../data/messages/messages');

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
      .set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
