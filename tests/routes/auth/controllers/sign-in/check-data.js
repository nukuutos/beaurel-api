const master = require('../../../../data/users/master');
const { predictableFields: predictableFieldsAuthData } = require('./schemas/auth-data');

const checkData = (data) => {
  const { accessToken, ...predictableFields } = data;
  const predictableData = predictableFieldsAuthData(master);
  expect(predictableData).toStrictEqual(predictableFields);
  expect(typeof accessToken).toBe('string');
};

module.exports = checkData;
