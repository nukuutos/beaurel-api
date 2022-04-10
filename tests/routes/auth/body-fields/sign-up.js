const dataPreparation = require('../../../utils/data-preparation');
const phone = require('./fields/phone');
const firstName = require('./fields/first-name');
const lastName = require('./fields/last-name');
const passwordSignUp = require('./fields/password-sign-up');
const specialization = require('./fields/specialization');
const street = require('./fields/place-of-work/street');
const house = require('./fields/place-of-work/house');
const floor = require('./fields/place-of-work/floor');
const building = require('./fields/place-of-work/building');
const roomValue = require('./fields/place-of-work/room/room-value');
const roomType = require('./fields/place-of-work/room/room-type');

const placeOfWorkData = {
  street: 'Тургенево',
  house: '13',
  building: '2',
  floor: '3',
  room: {
    type: 'salon',
    value: 'Хороший салон',
  },
};

const dataCustomer = {
  phone: '+79999999999',
  password: '123456',
  confirmedPassword: '123456',
  firstName: 'Тест',
  lastName: 'Тестов',
  city: 'Владивосток',
};

const dataMaster = {
  phone: '+79999999999',
  password: '123456',
  specialization: 'Визажист',
  confirmedPassword: '123456',
  firstName: 'Тест',
  lastName: 'Тестов',
  city: 'Владивосток',
  placeOfWork: placeOfWorkData,
};

const fieldsPlaceOfWork = [street, house, floor, building, roomValue, roomType];

const fieldsCustomer = [phone, passwordSignUp, firstName, lastName];
const fieldsMaster = [
  phone,
  passwordSignUp,
  firstName,
  lastName,
  specialization,
  ...fieldsPlaceOfWork,
];

const fieldsCustomerTests = dataPreparation(fieldsCustomer, dataCustomer);
const fieldsMasterTests = dataPreparation(fieldsMaster, dataMaster);

const fieldsTests = [...fieldsCustomerTests, ...fieldsMasterTests];

module.exports = fieldsTests;
