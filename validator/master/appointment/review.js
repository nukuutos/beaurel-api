const { body, paramId } = require("express-validator");
const { MASTER_ID, APPOINTMENT_ID } = require("../../../config/id-names");

const {
  VALUE_REQUIRED,
  INVALID_VALUE,
  COMMENT_REQUIRED,
  COMMENT_LENGTH,
  INVALID_COMMENT,
} = require("../../../config/errors/review");

const appointmentId = paramId("appointmentId", APPOINTMENT_ID);
const masterId = paramId("masterId", MASTER_ID);

const value = body("value")
  .exists({ checkFalsy: true })
  .withMessage(VALUE_REQUIRED)
  .isInt({ min: 1, max: 5 })
  .withMessage(INVALID_VALUE)
  .customSanitizer((value) => +value);

const comment = body("comment")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(COMMENT_REQUIRED)
  .isLength({ min: 3, max: 500 })
  .withMessage(COMMENT_LENGTH)
  .matches(/^[а-я -,.!?()0-9]+$/i)
  .withMessage(INVALID_COMMENT);

exports.addReview = [masterId, appointmentId, value, comment];
exports.updateReview = [masterId, appointmentId, value, comment];
