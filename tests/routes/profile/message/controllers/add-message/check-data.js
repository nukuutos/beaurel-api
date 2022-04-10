const { matchersWithOptions } = require('jest-json-schema');
const Message = require('../../../../../../models/message');
const getDataForCompare = require('../../../../../utils/get-data-for-compare');

const { predictableFields, unpredictableFieldsSchema } = require('./schemas/message');

expect.extend(
  matchersWithOptions({
    verbose: true,
  })
);

const unpredictableFields = ['_id', 'createdAt'];

const checkData = async (data) => {
  const getData = async (projection) => await Message.findOne({}, projection);
  const { unpredictableData, predictableData } = await getDataForCompare(
    getData,
    unpredictableFields
  );

  expect(predictableData).toStrictEqual(predictableFields(data));
  expect(unpredictableData).toMatchSchema(unpredictableFieldsSchema);
};

module.exports = checkData;
