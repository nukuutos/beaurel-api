const { check, param } = require('express-validator');
const { ObjectId } = require('mongodb');

exports.fieldId = (fieldName, name) =>
  check(fieldName)
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`${name} is required.`)
    .isMongoId()
    .withMessage(`Not correcting ${name}.`)
    .customSanitizer((id) => new ObjectId(id));

exports.paramId = (paramName, name) =>
  param(paramName)
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage(`${name} is required.`)
    .isMongoId()
    .withMessage(`Not correcting ${name}.`)
    .customSanitizer((id) => new ObjectId(id));
