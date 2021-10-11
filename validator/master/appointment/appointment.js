const dayjs = require("dayjs");
const HttpError = require("../../../models/utils/http-error");
const { MASTER_ID, SERVICE_ID } = require("../../../config/id-names");
const { body, fieldId, paramId } = require("express-validator");

const {
  APPOINTMENT_START_REQUIRED,
  INVALID_APPOINTMENT_START,
  APPOINTMENT_END_REQUIRED,
  INVALID_APPOINTMENT_END,
  DATE_REQUIRED,
  INVALID_DATE,
} = require("../../../config/errors/appointment");

const masterId = paramId("masterId", MASTER_ID);
const serviceId = fieldId("serviceId", SERVICE_ID);

const timeStartAt = body("time.startAt")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(APPOINTMENT_START_REQUIRED)
  .isInt({ min: 0, max: 1440 })
  .withMessage(INVALID_APPOINTMENT_START)
  .customSanitizer((time) => +time);

const timeEndAt = body("time.endAt")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(APPOINTMENT_END_REQUIRED)
  .isInt({ min: 0, max: 1440 })
  .withMessage(INVALID_APPOINTMENT_END)
  .customSanitizer((time) => +time);

const date = body("date")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(DATE_REQUIRED)
  .isISO8601()
  .withMessage(INVALID_DATE)
  .customSanitizer((date) => dayjs(date).utc())
  .custom((date) => date.isReseted())
  .withMessage(INVALID_DATE)
  .custom((date) => {
    const todayUTC = dayjs().getTodayUTC();
    return date.isAfter(todayUTC);
  })
  .withMessage(INVALID_DATE);

exports.bookAppointment = [masterId, serviceId, timeStartAt, timeEndAt, date];
