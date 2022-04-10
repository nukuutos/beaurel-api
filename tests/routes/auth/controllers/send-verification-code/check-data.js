const { matchersWithOptions } = require('jest-json-schema');
const User = require('../../../../../models/user');
const getDataForCompare = require('../../../../utils/get-data-for-compare');
const { confirmedMaster } = require('./data-to-db');
const { predictableFields, unpredictableFieldsSchema } = require('./schemas/master-after-attempts');

expect.extend(
  matchersWithOptions({
    verbose: true,
  })
);

const checkData = async () => {
  const unpredictableFields = ['resetPassword.lastSendAt', 'resetPassword.verificationCode'];

  const getData = async (projection) => await User.findOne({}, projection);

  const { unpredictableData, predictableData } = await getDataForCompare(
    getData,
    unpredictableFields
  );

  expect(predictableData).toStrictEqual(predictableFields);
  expect(unpredictableData).toMatchSchema(unpredictableFieldsSchema);

  expect(confirmedMaster.resetPassword.verificationCode).not.toBe(
    unpredictableData.resetPassword.verificationCode
  );
};

module.exports = checkData;
