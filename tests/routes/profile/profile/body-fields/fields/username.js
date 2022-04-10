const {
  USERNAME_REQUIRED,
  INVALID_USERNAME,
  USERNAME_LENGTH,
} = require('../../../../../../config/errors/profile');

const moreMaxLength = 'оченьинетерсноеимятао';

const username = {
  name: 'username',
  tests: [
    {
      message: 'should fail, invalid field',
      data: { username: null },
      error: USERNAME_REQUIRED,
    },
    {
      message: 'should fail, field is required',
      data: {},
      error: USERNAME_REQUIRED,
    },
    {
      message: 'should fail, field is required',
      data: { username: '' },
      error: USERNAME_REQUIRED,
    },
    {
      message: 'should fail, field is required',
      data: { username: ' ' },
      error: USERNAME_LENGTH,
    },
    {
      message: 'should fail, invalid field',
      data: { username: 'wo_.r!d' },
      error: INVALID_USERNAME,
    },
    {
      message: 'should fail, invalid field',
      data: { username: '____' },
      error: INVALID_USERNAME,
    },
    {
      message: 'should fail, invalid field',
      data: { username: '....' },
      error: INVALID_USERNAME,
    },
    {
      message: 'should fail, invalid field',
      data: { username: 'profile' },
      error: INVALID_USERNAME,
    },
    {
      message: 'should fail, invalid field',
      data: { username: 'appointments' },
      error: INVALID_USERNAME,
    },
    {
      message: 'should fail, invalid field',
      data: { username: 'services' },
      error: INVALID_USERNAME,
    },
    {
      message: 'should fail, invalid field',
      data: { username: 'search' },
      error: INVALID_USERNAME,
    },
    {
      message: 'should fail, invalid field',
      data: { username: 'timetable' },
      error: INVALID_USERNAME,
    },
    {
      message: 'should fail, invalid field',
      data: { username: 'masters' },
      error: INVALID_USERNAME,
    },
    {
      message: 'should fail, invalid field',
      data: { username: 'settings' },
      error: INVALID_USERNAME,
    },
    {
      message: 'should fail, invalid length',
      data: { username: moreMaxLength },
      error: USERNAME_LENGTH,
    },
    {
      message: 'should fail, invalid length',
      data: { username: 'mo' },
      error: USERNAME_LENGTH,
    },
  ],
};

module.exports = username;
