const { check } = require('express-validator');
const { ObjectId } = require('mongodb');

exports.titleValidation = (field, fieldName) =>
  check(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(`${fieldName} is required`)
    .matches(/^[a-z]+$/i)
    .withMessage(`${fieldName} must be alphabetic`)
    .customSanitizer((title) => title.charAt(0).toUpperCase() + title.slice(1));

exports.durationValidation = (field, fieldName) =>
  check(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(`${fieldName} is required`)
    .isInt() //add min and max ms
    .withMessage(`${fieldName} must be numeric`)
    .customSanitizer((num) => Number(num));

exports.priceValidation = (field, fieldName) =>
  check(field)
    .trim()
    .exists()
    .withMessage('Price is required')
    .isInt() //add min and max ms
    .withMessage(`${fieldName} must be numeric`)
    .customSanitizer((num) => Number(num));

exports.parameterValidation = (field, fieldName) =>
  check(field).trim().exists({ checkFalsy: true }).withMessage(`${fieldName} must be a string`);

exports.orderValidation = (field, fieldName) =>
  check(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(`${fieldName} is required.`)
    .isInt() //add min and max ms
    .withMessage(`${fieldName} must be numeric`)
    .customSanitizer((num) => Number(num));

exports.subOrderValidation = (field, fieldName) =>
  check(field)
    .trim()
    .exists()
    .withMessage(`${fieldName} is required.`)
    .customSanitizer((value) => {
      if (value) return Number(value);
      return null;
    });
