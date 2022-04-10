const customerData = {
  phone: '+79999999999',
  password: '123456',
  confirmedPassword: '123456',
  firstName: 'Тест',
  lastName: 'Тест',
  city: 'Владивосток',
};

const masterData = {
  ...customerData,
  specialization: 'Визажист',
  placeOfWork: {
    street: 'Тургенево',
    house: '13',
    building: '',
    floor: '3',
    room: {
      type: 'salon',
      value: 'Хороший салон',
    },
  },
};

module.exports = { customerData, masterData };
