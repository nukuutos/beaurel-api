const { matchersWithOptions } = require('jest-json-schema');
const User = require('../../../../../models/user');
const getDataForCompare = require('../../../../utils/get-data-for-compare');

const {
  predictableFields: predictableFieldsMaster,
  unpredictableFieldsSchema: unpredictableFieldsSchemaMaster,
} = require('./schemas/master');

const {
  predictableFields: predictableFieldsCustomer,
  unpredictableFieldsSchema: unpredictableFieldsSchemaCustomer,
} = require('./schemas/customer');

expect.extend(
  matchersWithOptions({
    verbose: true,
  })
);

const unpredictableFields = [
  '_id',
  'createdAt',
  'password',
  'confirmation.lastSendAt',
  'confirmation.verificationCode',
];

const checkMasterData = async (data) => {
  const getData = async (projection) => await User.findOne({}, projection);
  const { unpredictableData, predictableData } = await getDataForCompare(
    getData,
    unpredictableFields
  );

  expect(predictableData).toStrictEqual(predictableFieldsMaster(data));
  expect(unpredictableData).toMatchSchema(unpredictableFieldsSchemaMaster);
};

const checkCustomerData = async (data) => {
  const getData = async (projection) => await User.findOne({}, projection);
  const { unpredictableData, predictableData } = await getDataForCompare(
    getData,
    unpredictableFields
  );

  expect(predictableData).toStrictEqual(predictableFieldsCustomer(data));
  expect(unpredictableData).toMatchSchema(unpredictableFieldsSchemaCustomer);
};

module.exports = { checkMasterData, checkCustomerData };
