const master = require('../../../../../../data/users/master');
const master1 = require('../../../../../../data/users/master-1');

const unpredictableFieldsSchema = {
  properties: {
    _id: {
      oneOf: [{ type: 'string' }, { type: 'object' }],
    },
    createdAt: { type: 'object' },
  },
  required: ['_id', 'createdAt'],
};

const predictableFields = ({ message }) => ({
  senderId: master._id,
  recipientId: master1._id,
  message,
  isUnread: true,
});

module.exports = { predictableFields, unpredictableFieldsSchema };
