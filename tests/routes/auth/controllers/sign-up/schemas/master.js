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

const predictableFields = ({ phone, specialization, firstName, lastName, city, placeOfWork }) => ({
  phone,
  firstName,
  lastName,
  specialization,
  username: null,
  isAvatar: false,
  city,
  masters: [],
  placeOfWork,
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
  tools: {
    isServices: false,
    isTimetable: false,
  },
  role: 'master',
});

module.exports = { predictableFields, unpredictableFieldsSchema };
