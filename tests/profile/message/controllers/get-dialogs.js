const dayjs = require('dayjs');
const Message = require('../../../../models/message');
const User = require('../../../../models/user');
const master = require('../../../data/masters/master');
const dialogs = require('../../../data/messages/dialogs');

module.exports = function () {
  beforeEach(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await User.save(master);
    await Message.insertMany(dialogs);
  });

  it('should successfully get sorted dialogs', async () => {
    const response = await this.request().query({ page: 0 });

    const { statusCode, body } = response;

    expect(statusCode).toBe(200);

    let { dialogs } = body;

    dialogs = dialogs.map((message) => ({ ...message, createdAt: dayjs(message.createdAt) }));

    expect(dialogs).toHaveLength(20);

    const isSorted = dialogs.every((currentMessage, index) => {
      if (index === 0) return true;

      const prevDialog = dialogs[index - 1];
      const difference = currentMessage.createdAt.diff(prevDialog.createdAt);

      if (difference <= 0) return true;
      return false;
    });

    expect(isSorted).toBeTruthy();
  });

  it('should detect unauthorized action', async () => {
    const response = await this.request()
      .query({ category: 'history' })
      .set('Authorization', 'hacky');

    const { statusCode } = response;

    expect(statusCode).toBe(401);
  });
};
