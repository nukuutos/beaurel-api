const { body, param } = require('express-validator');

const {
  TITLE_LENGTH,
  TITLE_REQUIRED,
  INVALID_TITLE,
  DURATION_REQUIRED,
  DURATION_NUMBER,
  PRICE_REQUIRED,
  PRICE_NUMBER,
  PARAMETER_REQUIRED,
  PARAMETER_LENGTH,
  INVALID_PARAMETER,
  ORDER_REQUIRED,
  SUBORDER_NUMBER,
  ORDER_NUMBER,
  TITLE_ID_LENGTH,
  INVALID_TITLE_ID,
  INVALID_DURATION,
} = require('../../../config/errors/service');

exports.titleId = (paramName) =>
  param(paramName)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(TITLE_REQUIRED)
    .isLength({ min: 3, max: 50 })
    .withMessage(TITLE_ID_LENGTH)
    .matches(/^[а-яё -,.!?()0-9]+$/i)
    .withMessage(INVALID_TITLE_ID);

exports.titleValidation = (field) =>
  body(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(TITLE_REQUIRED)
    .isLength({ min: 3, max: 50 })
    .withMessage(TITLE_LENGTH)
    .matches(/^[а-яё -,.!?()0-9]+$/i)
    .withMessage(INVALID_TITLE)
    .customSanitizer((title) => title.charAt(0).toUpperCase() + title.slice(1));

exports.durationValidation = (field) =>
  body(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(DURATION_REQUIRED)
    .isInt({ min: 1, max: 1440 })
    .withMessage(DURATION_NUMBER)
    .customSanitizer((num) => +num)
    .custom((value) => value % 30 === 0)
    .withMessage(INVALID_DURATION);

exports.priceValidation = (field) =>
  body(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(PRICE_REQUIRED)
    .isInt({ min: 0, max: 99999 })
    .withMessage(PRICE_NUMBER)
    .customSanitizer((num) => +num);

exports.parameterValidation = (field) =>
  body(field)
    .trim()
    .exists({ checkFalsy: true })
    .withMessage(PARAMETER_REQUIRED)
    .isLength({ min: 2, max: 10 })
    .withMessage(PARAMETER_LENGTH)
    .matches(/^[а-яА-Я -,.!?()0-9]+$/i)
    .withMessage(INVALID_PARAMETER);

exports.orderValidation = (field) =>
  body(field)
    .not()
    .isString()
    .withMessage(ORDER_REQUIRED)
    .custom((value) => {
      if (value === null) return true;
      if (value < 0) return false;
      return true;
    })
    .withMessage(ORDER_NUMBER)
    .customSanitizer((value) => (isNaN(value) ? null : +value));

exports.subOrderValidation = (field) =>
  body(field)
    .not()
    .isString()
    .withMessage(SUBORDER_NUMBER)
    .custom((value) => {
      console.log(typeof value, value);
      if (value === null) return true;
      if (value < 0) return false;
      return true;
    })
    .withMessage(SUBORDER_NUMBER)
    .customSanitizer((value) => (isNaN(value) ? null : +value));
