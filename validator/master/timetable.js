const { check } = require("express-validator");
const { paramId } = require("../utils/id");
const HttpError = require("../../models/http-error");
const dayjs = require("dayjs");

const timetableId = paramId("timetableId", "Timetable Id");
const masterId = paramId("masterId", "Master Id");

// general
const sessionTime = check("sessionTime")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage("Session Time is required")
  .isInt({ min: 1, max: 1440 })
  .withMessage("Session Time must be numeric")
  .customSanitizer((num) => +num);

const type = check("type")
  .exists({ checkFalsy: true })
  .withMessage("Type is required")
  .custom((type) => {
    const types = ["auto", "manually"];
    if (!types.includes(type)) throw new HttpError("Incorrect type", 400);
    return true;
  });

const date = check("date")
  .exists({ checkFalsy: true })
  .withMessage("Date is required")
  .customSanitizer((date) => {
    console.log(date);
    return dayjs(date).utc();
  })
  .custom((date) => {
    // expect date in utc
    console.log(date.format());
    const [hour, minute, second, utcOffset] = [date.hour(), date.minute(), date.second(), date.utcOffset()];
    if (hour !== 0 || minute !== 0 || second !== 0 || utcOffset !== 0) throw new HttpError("Invalid date", 400);

    const todayUTC = dayjs().add(dayjs().utcOffset(), "m").utcOffset(0).second(0).minute(0).hour(0);
    if (date.isBefore(todayUTC)) throw new HttpError("Invalid date", 400);

    return true;
  });

// auto
const workingDayStartAt = check("auto.workingDay.startAt")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage("Start day time is required")
  .isInt({ min: 0, max: 1440 })
  .withMessage("Start day time must be numeric")
  .customSanitizer((num) => +num);

const workingDayEndAt = check("auto.workingDay.endAt")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage("End day time is required")
  .isInt({ min: 0, max: 1440 })
  .withMessage("End day time must be numeric")
  .customSanitizer((num) => +num)
  .custom((endAt, { req }) => {
    const { startAt } = req.body.auto.workingDay;
    if (endAt < startAt) {
      throw new Error("End day time cant be lesser than start day time");
    }
    return true;
  });

const weekends = check("auto.weekends.*")
  .trim()
  .exists({ checkFalsy: true })
  .withMessage("Weekends are required")
  .isInt(0, 6)
  .withMessage("Weekends must be int from 0 to 6")
  .customSanitizer((num) => +num);

// exceptions
const exceptions = check("auto.exceptions.*.*").customSanitizer((num) => +num);

// manually, appointments
const appointments = check("manually.appointments.*.*").customSanitizer((num) => +num);

const auto = [workingDayStartAt, workingDayEndAt, weekends, exceptions];
const manually = [appointments];

exports.getTimetable = [masterId];
exports.updateTimetable = [masterId, timetableId, type, sessionTime, ...auto, ...manually, date];
exports.deleteTimetableUpdate = [masterId, timetableId];
// exports.createTimetable = [workingDayStartAt, workingDayEndAt, sessionTime, weekends];
exports.getTimetableAndAppointments = [masterId];
