const dayjs = require('dayjs');
const { ObjectId } = require('mongodb');

module.exports = [
  {
    _id: new ObjectId('5eb849b81c2ccc21306ced34'),
    username: 'test',
    email: 'test@test.com',
    password: '$2a$10$XcAJi.gMUnDN7LQTlxonOuHYnxdPvXa9YhWTFwrpuxk.TtvV48jBW',
    firstName: 'Никита',
    lastName: 'Волошин',
    phone: '+79999999999',
    avatar: null,
    confirmation: {
      lastSendAt: dayjs().subtract(2, 'h').toDate(),
      isConfirmed: false,
      verificationCode: 'ABCD',
      attemptsCountLeft: 3,
      resendCountLeft: 3,
    },
    resetPassword: {
      lastSendAt: dayjs().subtract(2, 'h').toDate(),
      verificationCode: 'ABCD',
      attemptsCountLeft: 3,
    },
    placeOfWork: 'Vladivostok, Paper St. 32',
    role: 'master',
    aboutText:
      'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident repellat. Lorem ipsum dolor sit ameorib',
    createdAt: new Date(),
    specialization: 'Визажист',
    masters: [new ObjectId('5eb849b81c2ccc21306ced33'), new ObjectId('5eb849b81c2ccc21306ced32')],
    city: 'Владивосток',
    wasOnline: dayjs().subtract(6, 'd').toDate(),
    tools: { isTimetable: false, isServices: false },
  },
  {
    _id: new ObjectId('5eb849b81c2ccc21306ced33'),
    username: 'test',
    email: 'test@test.com',
    password: '$2a$10$XcAJi.gMUnDN7LQTlxonOuHYnxdPvXa9YhWTFwrpuxk.TtvV48jBW',
    firstName: 'Никита',
    lastName: 'Волошин',
    phone: '+79999999999',
    avatar: null,
    confirmation: {
      lastSendAt: dayjs().subtract(2, 'h').toDate(),
      isConfirmed: false,
      verificationCode: 'ABCD',
      attemptsCountLeft: 3,
      resendCountLeft: 3,
    },
    resetPassword: {
      lastSendAt: dayjs().subtract(2, 'h').toDate(),
      verificationCode: 'ABCD',
      attemptsCountLeft: 3,
    },
    placeOfWork: 'Vladivostok, Paper St. 32',
    role: 'master',
    aboutText:
      'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident repellat. Lorem ipsum dolor sit ameorib',
    createdAt: new Date(),
    specialization: 'Визажист',
    masters: [new ObjectId('5eb849b81c2ccc21306ced33'), new ObjectId('5eb849b81c2ccc21306ced32')],
    city: 'Владивосток',
    wasOnline: new Date('1995-12-17T03:24:00'),
    tools: { isTimetable: false, isServices: false },
  },
  {
    _id: new ObjectId('5eb849b81c2ccc21306ced32'),
    username: 'test',
    email: 'test@test.com',
    password: '$2a$10$XcAJi.gMUnDN7LQTlxonOuHYnxdPvXa9YhWTFwrpuxk.TtvV48jBW',
    firstName: 'Никита',
    lastName: 'Волошин',
    phone: '+79999999999',
    avatar: null,
    confirmation: {
      lastSendAt: dayjs().subtract(1, 'h').toDate(),
      isConfirmed: true,
      verificationCode: 'ABCD',
      attemptsCountLeft: 3,
      resendCountLeft: 3,
    },
    resetPassword: {
      lastSendAt: dayjs().subtract(1, 'h').toDate(),
      verificationCode: 'ABCD',
      attemptsCountLeft: 3,
    },
    placeOfWork: 'Vladivostok, Paper St. 32',
    role: 'master',
    aboutText:
      'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident repellat. Lorem ipsum dolor sit ameorib',
    createdAt: new Date(),
    specialization: 'Визажист',
    masters: [new ObjectId('5eb849b81c2ccc21306ced33'), new ObjectId('5eb849b81c2ccc21306ced32')],
    city: 'Владивосток',
    wasOnline: new Date('1995-12-17T03:24:00'),
    tools: { isTimetable: false, isServices: false },
  },
];
