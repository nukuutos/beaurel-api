const { ObjectId } = require('mongodb');

module.exports = {
  _id: new ObjectId('5eb849b81c2ccc21306ced34'),
  username: 'test',
  email: 'test@test.com',
  password: '$2a$10$XcAJi.gMUnDN7LQTlxonOuHYnxdPvXa9YhWTFwrpuxk.TtvV48jBW',
  firstName: 'Никита',
  lastName: 'Волошин',
  phone: '+79999999999',
  avatar: null,
  confirmation: {
    lastSendAt: new Date(),
    isConfirmed: false,
    verificationCode: 'ABCD',
    attemptsCountLeft: 5,
    resendCountLeft: 5,
  },
  resetPassword: {
    lastSendAt: null,
    verificationCode: 'ABCD',
    attemptsCountLeft: 5,
    resendCountLeft: 5,
  },
  placeOfWork: 'Vladivostok, Paper St. 32',
  role: 'master',
  aboutText:
    'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident repellat. Lorem ipsum dolor sit ameorib',
  createdAt: { $date: '2020-05-10T18:36:40.515Z' },
  specialization: 'Визажист',
  masters: [new ObjectId('5eb849b81c2ccc21306ced33'), new ObjectId('5eb849b81c2ccc21306ced32')],
  city: 'Владивосток',
  wasOnline: new Date('1995-12-17T03:24:00'),
  tools: { isTimetable: false, isServices: false },
};
