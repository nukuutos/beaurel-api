const {
  UPDATE_DATE_REQUIRED,
  INVALID_UPDATE_DATE,
} = require('../../../../../../config/errors/timetable');

const date = {
  name: 'date',
  tests: [
    {
      message: 'should fail, invalid param',
      data: { date: null },
      error: UPDATE_DATE_REQUIRED,
    },
    {
      message: 'should fail, invalid param',
      data: {},
      error: UPDATE_DATE_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { date: '' },
      error: UPDATE_DATE_REQUIRED,
    },
    {
      message: 'should fail, invalid field',
      data: { date: ' ' },
      error: INVALID_UPDATE_DATE,
    },
    {
      message: 'should fail, past data',
      data: { date: '2020-12-24T00:00:00.000Z' },
      error: INVALID_UPDATE_DATE,
    },
    {
      message: 'should fail, invalid field(hour)',
      data: { date: '2023-12-24T01:00:00.000Z' },
      error: INVALID_UPDATE_DATE,
    },
    {
      message: 'should fail, invalid field(minute)',
      data: { date: '2023-12-24T00:01:00.000Z' },
      error: INVALID_UPDATE_DATE,
    },
    {
      message: 'should fail, invalid field(second)',
      data: { date: '2023-12-24T00:00:01.000Z' },
      error: INVALID_UPDATE_DATE,
    },
    {
      message: 'should fail, invalid field(ms)',
      data: { date: '2023-12-24T00:00:00.100Z' },
      error: INVALID_UPDATE_DATE,
    },
    {
      message: 'should fail, invalid field(not utc)',
      data: { date: '2023-12-24T00:00:00.000+03:30' },
      error: INVALID_UPDATE_DATE,
    },
    {
      message: 'should fail, invalid field(not utc)',
      data: { date: '2023-12-24T00:00:00+03:30' },
      error: INVALID_UPDATE_DATE,
    },
    {
      message: 'should fail, date is before than today',
      data: { date: '2021-09-24T00:00:00Z' },
      error: INVALID_UPDATE_DATE,
    },
  ],
};

module.exports = date;
