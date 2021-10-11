const validator = require("express-validator");
const { param, body } = validator;
const { ObjectId } = require("mongodb");

const paramId = (paramName, name) =>
  param(paramName)
    .exists({ checkFalsy: true })
    .withMessage(`${name} отсутствует!`)
    .isMongoId()
    .withMessage(`Некорректный ${name}!`)
    .customSanitizer((id) => new ObjectId(id));

const fieldId = (fieldName, name) =>
  body(fieldName)
    .exists({ checkFalsy: true })
    .withMessage(`${name} отсутствует!`)
    .isMongoId()
    .withMessage(`Некорректный ${name}!`)
    .customSanitizer((id) => new ObjectId(id));

validator.paramId = paramId;
validator.fieldId = fieldId;
