const messageSchema = {
  properties: {
    _id: {
      oneOf: [{ type: 'string' }, { type: 'object' }],
    },
    senderId: {
      oneOf: [{ type: 'string' }, { type: 'object' }],
    },
    recipientId: {
      oneOf: [{ type: 'string' }, { type: 'object' }],
    },
    isUnread: { type: 'boolean' },
    message: { type: 'string' },
    createdAt: { type: 'object' },
  },
  required: ['_id', 'isUnread', 'senderId', 'recipientId', 'message', 'createdAt'],
};

module.exports = messageSchema;
