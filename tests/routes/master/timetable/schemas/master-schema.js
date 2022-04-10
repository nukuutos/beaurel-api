const timetableSchema = {
  properties: {
    _id: { type: 'object' },
    sessionTime: { type: 'number' },
    type: { type: 'string' },
    auto: {
      type: 'object',

      properties: {
        workingDay: {
          type: 'object',
          properties: {
            startAt: { type: 'number' },
            endAt: { type: 'number' },
          },
          required: ['startAt', 'endAt'],
        },

        weekends: {
          type: 'array',
          items: { type: 'number' },
        },

        exceptions: {
          type: 'object',
          properties: {
            0: { type: 'array', items: { type: 'number' } },
            1: { type: 'array', items: { type: 'number' } },
            2: { type: 'array', items: { type: 'number' } },
            3: { type: 'array', items: { type: 'number' } },
            4: { type: 'array', items: { type: 'number' } },
            5: { type: 'array', items: { type: 'number' } },
            6: { type: 'array', items: { type: 'number' } },
          },
        },

        possibleAppointmentsTime: {
          type: 'array',
          items: { type: 'number' },
        },
      },
      required: ['exceptions', 'weekends', 'possibleAppointmentsTime', 'workingDay'],
    },

    manually: {
      type: 'object',

      properties: {
        appointments: {
          type: 'object',
          properties: {
            0: { type: 'array', items: { type: 'number' } },
            1: { type: 'array', items: { type: 'number' } },
            2: { type: 'array', items: { type: 'number' } },
            3: { type: 'array', items: { type: 'number' } },
            4: { type: 'array', items: { type: 'number' } },
            5: { type: 'array', items: { type: 'number' } },
            6: { type: 'array', items: { type: 'number' } },
          },
        },
      },
      required: ['appointments'],
    },
  },

  required: ['_id', 'sessionTime', 'type', 'auto', 'manually'],
};

module.exports = timetableSchema;
