const dataWithValidPhoneBy8 = { identificator: '89999999999', password: '123456' };
const dataWithValidPhoneBy7 = { identificator: '+79999999999', password: '123456' };
const dataWithValidId = { identificator: '5eb849b81c2ccc21306ced34', password: '123456' };
const dataWithValidUsername = { identificator: 'test', password: '123456' };

const dataWithInvalidPhoneBy7 = {
  identificator: '+79899999999',
  password: '123456',
};
const dataWithInvalidPhoneBy8 = {
  identificator: '89899999999',
  password: '123456',
};
const dataWithInvalidUsername = {
  identificator: 'testik',
  password: '123456',
};
const dataWithInvalidPassword = {
  identificator: '+79999999999',
  password: '1234567',
};

module.exports = {
  dataWithValidPhoneBy8,
  dataWithValidPhoneBy7,
  dataWithValidId,
  dataWithValidUsername,
  dataWithInvalidPhoneBy7,
  dataWithInvalidPhoneBy8,
  dataWithInvalidUsername,
  dataWithInvalidPassword,
};
