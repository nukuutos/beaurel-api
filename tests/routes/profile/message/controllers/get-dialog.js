const dayjs = require('dayjs');
const { matchersWithOptions } = require('jest-json-schema');
const Message = require('../../../../../models/message');
const User = require('../../../../../models/user');
const master = require('../../../../data/users/master');
const master1 = require('../../../../data/users/master-1');
const master2 = require('../../../../data/users/master-2');
const messageSchema = require('./utils/message-schema');
const messagesData = require('./utils/data/messages');
const { getIsSorted } = require('./utils/utils');

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

    const isSorted = getIsSorted(dialog);

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
      .set(`${process.env.AUTH_HEADER}`, 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
