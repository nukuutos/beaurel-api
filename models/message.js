const { MESSAGE } = require('../config/collection-names');
const Collection = require('./utils/collection/collection');

class Message extends Collection {
  static name = MESSAGE;

  constructor({ recipientId, senderId, message }) {
    super();

    this.senderId = senderId;
    this.recipientId = recipientId;
    this.message = message;
    this.isUnread = true;
    this.createdAt = new Date();
  }
}

module.exports = Message;
