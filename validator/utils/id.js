const { check, param } = require('express-validator');
const { ObjectId } = require('mongodb');

// const isObjectId = (id) => ObjectId.isValid(id) && new ObjectId(id) == id;

exports.fieldId = (fieldName, name) =>
  check(fieldName)
    .exists({ checkFalsy: true })
    .withMessage(`${name} is required.`)
    .isMongoId()
    .withMessage(`Not correcting ${name}.`)
    .customSanitizer((id) => new ObjectId(id));

exports.paramId = (paramName, name) =>
  param(paramName)
    .exists({ checkFalsy: true })
    .withMessage(`${name} is required.`)
    .isMongoId()
    .withMessage(`Not correcting ${name}.`)
    .customSanitizer((id) => {
      return new ObjectId(id);
    });

exports.titleId = (paramName, name) =>
  param(paramName).exists({ checkFalsy: true }).withMessage(`${name} is required.`);
