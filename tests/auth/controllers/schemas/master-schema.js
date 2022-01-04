const masterSchema = {
  properties: {
    _id: { type: 'object' },
    phone: { type: 'string' },
    password: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    specialization: { type: 'string' },
    email: { type: 'null' },
    username: { type: 'null' },
    avatar: { type: 'null' },
    confirmation: {
      type: 'object',
      properties: {
        lastSendAt: { type: 'object' },
        isConfirmed: { type: 'boolean' },
        verificationCode: { type: 'string', minLength: 4, maxLength: 4 },
        attemptsCountLeft: { type: 'number' },
        resendCountLeft: { type: 'number' },
      },
      required: [
        'isConfirmed',
        'verificationCode',
        'attemptsCountLeft',
        'resendCountLeft',
        'lastSendAt',
      ],
    },
    role: { type: 'string' },
    createdAt: { type: 'object' },
  },
  required: [
    '_id',
    'phone',
    'password',
    'firstName',
    'lastName',
    'avatar',
    'confirmation',
    'role',
    'createdAt',
    'email',
    'username',
    'specialization',
  ],
};

module.exports = masterSchema;
