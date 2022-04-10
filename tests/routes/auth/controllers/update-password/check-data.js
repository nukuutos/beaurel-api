const User = require('../../../../../models/user');
const getDataForCompare = require('../../../../utils/get-data-for-compare');
const masterAfterAttempt = require('./schemas/master-after-attempt');
const masterOnSuccess = require('./schemas/master-on-success');

const checkDataOnSuccess = async () => {
  const getData = async (projection) => await User.findOne({}, projection);
  const unpredictableFields = ['password'];

  const { predictableData, unpredictableData } = await getDataForCompare(
    getData,
    unpredictableFields
  );

  expect(predictableData).toStrictEqual(masterOnSuccess);

  expect(typeof unpredictableData.password).toBe('string');
  expect(typeof unpredictableData.password).not.toBe(masterOnSuccess.password);
};

const checkDataAfterAttempt = async () => {
  const getData = async (projection) => await User.findOne({}, projection);
  const unpredictableFields = ['password'];

  const { predictableData, unpredictableData } = await getDataForCompare(
    getData,
    unpredictableFields
  );

  expect(predictableData).toStrictEqual(masterAfterAttempt);

  expect(typeof unpredictableData.password).toBe('string');
  expect(typeof unpredictableData.password).not.toBe(masterAfterAttempt.password);
};

module.exports = { checkDataOnSuccess, checkDataAfterAttempt };
