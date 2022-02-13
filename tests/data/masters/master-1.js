const { ObjectId } = require('mongodb');

module.exports = {
  _id: new ObjectId('5eb849b81c2ccc21306ced33'),
  email: 'test1@test.com',
  password: '$2a$10$XcAJi.gMUnDN7LQTlxonOuHYnxdPvXa9YhWTFwrpuxk.TtvV48jBW',
  firstName: 'Тест',
  lastName: 'Тестов',
  avatar: null,
  isConfirmed: { email: false, phone: false },
  placeOfwork: 'Vladivostok, Paper St. 32',
  role: 'master',
  aboutText:
    'Lorem dolor sit amet consectetur adipisicing elit. Molestias sequi recusandae saepe, sunt optio provident repellat. Lorem ipsum dolor sit ameorib',
  createdAt: { $date: '2020-05-10T18:36:40.515Z' },
  specialization: 'Визажист',
  masters: [],
  city: 'Владивосток',
  tools: { isTimetable: false, isServices: false },
};
