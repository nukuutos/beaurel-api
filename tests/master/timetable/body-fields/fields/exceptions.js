const {
  EXCEPTIONS_REQUIRED,
  INVALID_EXCEPTIONS,
} = require('../../../../../config/errors/timetable');

const exceptions = {
  name: 'exceptions',
  tests: [
    {
      message: 'should fail, field required',
      data: { exceptions: '' },
      error: EXCEPTIONS_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: { exceptions: null },
      error: EXCEPTIONS_REQUIRED,
    },
    {
      message: 'should fail, field required',
      data: {},
      error: EXCEPTIONS_REQUIRED,
    },
    {
      message: 'should fail, invalid value',
      data: { exceptions: 45 },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid value',
      data: { exceptions: 'хахах' },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid value',
      data: { exceptions: [] },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid value',
      data: { exceptions: {} },
      error: INVALID_EXCEPTIONS,
    },

    {
      message: 'should fail, invalid key',
      data: {
        exceptions: {
          0: [],
          1: [],
          ha: [],
          3: [],
          4: {},
          5: [],
          6: [],
        },
      },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid key length',
      data: {
        exceptions: {
          0: [],
          1: [],
          3: [],
          4: [],
          5: [],
          6: [],
        },
      },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid key length',
      data: {
        exceptions: {
          0: [],
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
        },
      },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid value',
      data: {
        exceptions: {
          0: [],
          1: [],
          2: [],
          3: [],
          4: {},
          5: [],
          6: [],
        },
      },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid value',
      data: {
        exceptions: {
          0: [],
          1: [],
          2: [],
          3: [],
          4: 123,
          5: [],
          6: [],
        },
      },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid value',
      data: {
        exceptions: {
          0: [],
          1: [],
          2: [],
          3: [],
          4: ['haha'],
          5: [],
          6: [],
        },
      },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid value',
      data: {
        exceptions: {
          0: [],
          1: [],
          2: [],
          3: [],
          4: [-1],
          5: [],
          6: [],
        },
      },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid value',
      data: {
        exceptions: {
          0: [],
          1: [],
          2: [],
          3: [],
          4: [1441],
          5: [],
          6: [],
        },
      },
      error: INVALID_EXCEPTIONS,
    },
    {
      message: 'should fail, invalid array length(max 48)',
      data: {
        exceptions: {
          0: [],
          1: [],
          2: [],
          3: [],
          4: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
            47, 48, 49,
          ],
          5: [],
          6: [],
        },
      },
      error: INVALID_EXCEPTIONS,
    },
  ],
};

module.exports = exceptions;
