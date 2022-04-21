const { ObjectId } = require('mongodb');

module.exports = {
  _id: new ObjectId('5eb849b81c2ccc21306abd12'),
  email: 'test1@test.com',
  password: '$2a$10$XcAJi.gMUnDN7LQTlxonOuHYnxdPvXa9YhWTFwrpuxk.TtvV48jBW',
  firstName: 'Никита',
  lastName: 'Волошин',
  username: 'test1',
  avatar: null,
  isConfirmed: { email: false, phone: false },
  confirmation: {
    lastSendAt: null,
    isConfirmed: true,
    verificationCode: null,
    attemptsCountLeft: 5,
    resendCountLeft: 5,
  },
  role: 'customer',
  aboutText:
    'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident repellat. Lorem ipsum dolor sit ameorib',
  createdAt: { date: '2020-05-10T18:36:40.515Z' },
  masters: [],
  city: 'Владивосток',
  wasOnline: new Date('2021-12-17'),
};
