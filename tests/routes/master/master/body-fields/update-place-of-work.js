const street = require('./fields/street');
const house = require('./fields/house');
const floor = require('./fields/floor');
const building = require('./fields/building');
const roomValue = require('./fields/room-value');
const roomType = require('./fields/room-type');
const city = require('./fields/city');
const dataPreparation = require('../../../../utils/data-preparation');

const placeOfWorkData = {
  street: 'Тургенево',
  house: '13',
  building: '2',
  floor: '3',
  city: 'Хабаровск',
  room: {
    type: 'salon',
    value: 'Хороший салон',
  },
};

const tests = dataPreparation(
  [street, house, floor, building, city, roomValue, roomType],
  placeOfWorkData
);

module.exports = tests;
