const User = require('../../../../../models/user');
const { master } = require('./data-to-db');

const { predictableFields: predictableFieldsAuthData } = require('./schemas/auth-data');
const masterAfterAttempt = require('./schemas/master-after-attempt');
const confirmedMaster = require('./schemas/confirmed-master');

const checkAuthData = async (data) => {
  const { accessToken, ...predictableFields } = data;
  const predictableData = predictableFieldsAuthData(master);
  expect(predictableData).toStrictEqual(predictableFields);
  expect(typeof accessToken).toBe('string');
};

const checkConfirmedMaster = async () => {
  const master = await User.findOne({});
  expect(master).toStrictEqual(confirmedMaster);
};

const checkMasterAfterAttempt = async () => {
  const master = await User.findOne({});
  expect(master).toStrictEqual(masterAfterAttempt);
};

module.exports = { checkAuthData, checkConfirmedMaster, checkMasterAfterAttempt };
