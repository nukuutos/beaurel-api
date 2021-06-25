const { check } = require('express-validator');

exports.titleValidation = (field, fieldName) =>
  check(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(`${fieldName} is required`)
    // .isLength({ min: 3, max: 50 })
    // .withMessage(`${fieldName} must be between 3 and 50 characters`)
    .matches(/^[a-z]+$/i)
    .withMessage(`${fieldName} must be alphabetic`)
    .customSanitizer((title) => title.charAt(0).toUpperCase() + title.slice(1));

exports.durationValidation = (field, fieldName) =>
  check(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(`${fieldName} is required`)
    .isInt({ min: 1, max: 1440 })
    .withMessage(`${fieldName} must be numeric`)
    .customSanitizer((num) => Number(num));

exports.priceValidation = (field, fieldName) =>
  check(field)
    .trim()
    .exists()
    .withMessage('Price is required')
    .isInt({ min: 0, max: 99999 }) //add min and max ms
    .withMessage(`${fieldName} must be numeric`)
    .customSanitizer((num) => Number(num));

exports.parameterValidation = (field, fieldName) =>
  check(field).trim().exists({ checkFalsy: true }).withMessage(`${fieldName} must be a string`);
// .isLength({ min: 2, max: 10 })
// .withMessage(`${fieldName} must be between 2 and 10 characters`);

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
