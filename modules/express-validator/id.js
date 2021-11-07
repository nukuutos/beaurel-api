const validator = require("express-validator");
const { ObjectId } = require("mongodb");

const { param, body } = validator;

const { noParam, invalidParam } = require("../../config/errors/id");

const paramId = (paramName, name) =>
  param(paramName)
    .isMongoId()
    .withMessage(invalidParam(name))
    .bail()
    .customSanitizer((id) => new ObjectId(id));

const fieldId = (fieldName, name) =>
  body(fieldName)
    .exists({ checkFalsy: true })
    .withMessage(noParam(name))
    .isMongoId()
    .withMessage(invalidParam(name))
    .bail()
    .customSanitizer((id) => new ObjectId(id));

validator.paramId = paramId;
validator.fieldId = fieldId;
