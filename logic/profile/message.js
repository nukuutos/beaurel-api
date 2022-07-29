const { MESSAGE, USER } = require('../../config/collection-names');
const MessageModel = require('../../models/message');
const { getIO } = require('../../utils/socket');
const HttpError = require('../../models/utils/http-error');
const { NO_USER } = require('../../config/errors/message');
const {
  GET_MESSAGE_FROM_INTERLOCUTOR,
  SET_MESSAGES_VIEWED_BY_RECIPIENT,
} = require('../../config/socket-io/types');
const senderAndRecipient = require('../../pipelines/message/sender-and-recipient');
const { getAggregate } = require('../../utils/database/database');
const dialogs = require('../../pipelines/message/dialogs');

const { IS_SOCKET_IO } = process.env;

class Message extends MessageModel {
  static name = MESSAGE;

  constructor({ recipientId, senderId, message }) {
    super({ recipientId, senderId, message });
  }

  static async getDialogs(userId, page) {
    const pipeline = dialogs(userId, page);
    const data = await this.aggregate(pipeline).toArray();
    return data;
  }

  static async getDialog({ userId, interlocutorId, page }) {
    Message.updateMany(
      {
        senderId: interlocutorId,
        recipientId: userId,
        isUnread: true,
      },
      { isUnread: false }
    );

    const messages = await Message.find(
      {
        $or: [
          { senderId: userId, recipientId: interlocutorId },
          { senderId: interlocutorId, recipientId: userId },
        ],
      },
      {},
      { sort: { createdAt: -1 }, limit: 20, page }
    );

    return messages;
  }

  async getData() {
    const { recipientId, senderId } = this;
    const pipeline = senderAndRecipient(senderId, recipientId);
    const aggregate = getAggregate(USER);
    const data = await aggregate(pipeline).next();
    this.data = data;
  }

  setSenderData() {
    this.user = this.data.sender;
    return this;
  }

  isRecipientExisted() {
    if (!this.data.recipient?._id) throw new HttpError(NO_USER, 400);
    return this;
  }

  async save() {
    const { user, data, ...messageData } = this;
    await Message.save(messageData);
  }

  sendToClient() {
    if (!IS_SOCKET_IO) return this;

    const io = getIO();

    const { data, ...message } = this;

    io.emit(this.recipientId, {
      type: GET_MESSAGE_FROM_INTERLOCUTOR,
      payload: { message },
    });

    return this;
  }

  static setMessagesViewed({ userId, interlocutorId }) {
    if (IS_SOCKET_IO) {
      const io = getIO();
      io.emit(interlocutorId, {
        type: SET_MESSAGES_VIEWED_BY_RECIPIENT,
        payload: { recipientId: userId },
      });
    }

    Message.updateMany(
      {
        senderId: interlocutorId,
        recipientId: userId,
        isUnread: true,
      },
      { isUnread: false }
    );
  }
}

module.exports = Message;
