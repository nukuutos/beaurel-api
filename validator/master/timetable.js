const dayjs = require("dayjs");
const { body, paramId } = require("express-validator");
const { TIMETABLE_ID, MASTER_ID } = require("../../config/id-names");

const {
  SESSION_TIME_REQUIRED,
  SESSION_TIME_DURATION,
  TYPE_REQUIRED,
  INVALID_TYPE,
  UPDATE_DATE_REQUIRED,
  INVALID_UPDATE_DATE,
  START_DAY_TIME_REQUIRED,
  INVALID_START_DAY_TIME,
  END_DAY_TIME_REQUIRED,
  INVALID_END_DAY_TIME,
  START_TIME_OVER_END_TIME,
  WEEKENDS_REQUIRED,
  INVALID_WEEKENDS,
} = require("../../config/errors/timetable");

const timetableId = paramId("timetableId", TIMETABLE_ID);
const masterId = paramId("masterId", MASTER_ID);

// general
const sessionTime = body("sessionTime")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(SESSION_TIME_REQUIRED)
  .customSanitizer((num) => +num)
  .custom((sessionTime) => {
    const availableDurations = [30, 60, 90, 120];
    return availableDurations.includes(sessionTime);
  })
  .withMessage(SESSION_TIME_DURATION);

const type = body("type")
  .exists({ checkFalsy: true })
  .withMessage(TYPE_REQUIRED)
  .custom((type) => {
    const types = ["auto", "manually"];
    return types.includes(type);
  })
  .withMessage(INVALID_TYPE);

const date = body("date")
  .exists({ checkFalsy: true })
  .withMessage(UPDATE_DATE_REQUIRED)
  .customSanitizer((date) => dayjs(date).utc())
  .custom((date) => date.isReseted())
  .withMessage(INVALID_UPDATE_DATE)
  .custom((date) => {
    const todayUTC = dayjs().getTodayUTC();
    return date.isAfter(todayUTC);
  })
  .withMessage(INVALID_UPDATE_DATE);

// auto
const workingDayStartAt = body("auto.workingDay.startAt")
  .trim()
  .exists({ checkFalsy: null })
  .withMessage(START_DAY_TIME_REQUIRED)
  .isInt({ min: 0, max: 1440 })
  .withMessage(INVALID_START_DAY_TIME)
  .customSanitizer((num) => +num);

const workingDayEndAt = body("auto.workingDay.endAt")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(END_DAY_TIME_REQUIRED)
  .isInt({ min: 0, max: 1440 })
  .withMessage(INVALID_END_DAY_TIME)
  .customSanitizer((num) => +num)
  .custom((endAt, { req }) => {
    const { startAt } = req.body.auto.workingDay;
    return endAt > startAt;
  })
  .withMessage(START_TIME_OVER_END_TIME);

const weekends = body("auto.weekends.*")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage(WEEKENDS_REQUIRED)
  .isInt(0, 6)
  .withMessage(INVALID_WEEKENDS)
  .customSanitizer((num) => +num);

const exceptions = body("auto.exceptions.*.*").customSanitizer((num) => +num);

const manuallyAppointments = body("manually.appointments.*.*").customSanitizer((num) => +num);

const auto = [workingDayStartAt, workingDayEndAt, weekends, exceptions];
const manually = [manuallyAppointments];

exports.getTimetable = [masterId];
exports.updateTimetable = [masterId, timetableId, type, sessionTime, ...auto, ...manually, date];
exports.deleteTimetableUpdate = [masterId, timetableId];
exports.getTimetableAndAppointments = [masterId];
