const validator = require("express-validator");
const { body } = validator;

const expectedFields = function (expectedFields) {
  return this.customSanitizer((value, { req, path: fieldName }) => {
    const isExpected = expectedFields.includes(fieldName);

    if (!isExpected) {
      delete req.body[fieldName];
      return;
    }

    return value;
  });
};

validator.body = function () {
  const result = body.apply(this, arguments);
  result.expectedFields = expectedFields;

  return result;
};
