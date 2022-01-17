const dayjs = require('dayjs');
const { matchersWithOptions } = require('jest-json-schema');
const Message = require('../../../../models/message');
const User = require('../../../../models/user');
const master = require('../../../data/masters/master');
const master1 = require('../../../data/masters/master-1');
const master2 = require('../../../data/masters/master-2');
const messagesData = require('../../../data/messages/messages');
const messageSchema = require('./schemas/message-schema');

expect.extend(matchersWithOptions({ verbose: true }));

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await User.insertMany([master, master1, master2]);
    await Message.insertMany(messagesData);
  });

  it('should successfully get sorted first 20 messages', async () => {
    const response = await this.request().query({ page: 0 });

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    let { dialog } = body;

    dialog = dialog.map((message) => ({ ...message, createdAt: dayjs(message.createdAt) }));

    expect(dialog).toHaveLength(20);

    dialog.forEach((message) => {
      expect(message).toMatchSchema(messageSchema);
    });

    const isSorted = dialog.every((currentMessage, index) => {
      if (index === 0) return true;

      const prevMessage = dialog[index - 1];
      const difference = currentMessage.createdAt.diff(prevMessage.createdAt);

      if (difference <= 0) return true;
      return false;
    });

    expect(isSorted).toBeTruthy();

    expect(dialog[0].message).toBe('last');
    expect(dialog[19].message).toBe('first');
  });

  it('should successfully get last message (page = 1)', async () => {
    const response = await this.request().query({ page: 1 });

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    let { dialog } = body;

    dialog = dialog.map((message) => ({ ...message, createdAt: dayjs(message.createdAt) }));

    expect(dialog).toHaveLength(1);
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request()
      .query({ category: 'history' })
      .set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
