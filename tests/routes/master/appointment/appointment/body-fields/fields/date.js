const { INVALID_DATE, DATE_REQUIRED } = require('../../../../../../../config/errors/appointment');

const date = {
  name: 'date',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { date: null },
      error: DATE_REQUIRED,
    },
    {
      message: 'should fail, invalid param',
      data: {},
      error: DATE_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { date: '' },
      error: DATE_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { date: ' ' },
      error: INVALID_DATE,
    },
    {
      message: 'should fail, past data',
      data: { date: '2020-12-24T00:00:00.000Z' },
      error: INVALID_DATE,
    },
    {
      message: 'should fail, invalid field(hour)',
      data: { date: '2023-12-24T01:00:00.000Z' },
      error: INVALID_DATE,
    },
    {
      message: 'should fail, invalid field(minute)',
      data: { date: '2023-12-24T00:01:00.000Z' },
      error: INVALID_DATE,
    },
    {
      message: 'should fail, invalid field(second)',
      data: { date: '2023-12-24T00:00:01.000Z' },
      error: INVALID_DATE,
    },
    {
      message: 'should fail, invalid field(ms)',
      data: { date: '2023-12-24T00:00:00.100Z' },
      error: INVALID_DATE,
    },
    {
      message: 'should fail, invalid field(not utc)',
      data: { date: '2023-12-24T00:00:00.000+03:30' },
      error: INVALID_DATE,
    },
    {
      message: 'should fail, invalid field(not utc)',
      data: { date: '2023-12-24T00:00:00+03:30' },
      error: INVALID_DATE,
    },
  ],
};

module.exports = date;
