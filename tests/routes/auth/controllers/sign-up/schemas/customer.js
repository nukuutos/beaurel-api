const unpredictableFieldsSchema = {
  properties: {
    _id: { type: 'object' },
    password: { type: 'string' },
    createdAt: { type: 'object' },
    confirmation: {
      properties: {
        lastSendAt: { type: 'object' },
        verificationCode: { type: 'string' },
      },

      required: ['lastSendAt', 'verificationCode'],
    },
  },
  required: ['_id', 'password', 'confirmation', 'createdAt'],
};

const predictableFields = ({ phone, firstName, lastName, city }) => ({
  phone,
  firstName,
  lastName,
  username: null,
  avatar: null,
  city,
  masters: [],
  confirmation: {
    isConfirmed: false,
    attemptsCountLeft: 5,
    resendCountLeft: 5,
  },
  resetPassword: {
    attemptsCountLeft: 5,
    lastSendAt: null,
    resendCountLeft: 5,
    verificationCode: null,
  },
  role: 'customer',
});

module.exports = { predictableFields, unpredictableFieldsSchema };
