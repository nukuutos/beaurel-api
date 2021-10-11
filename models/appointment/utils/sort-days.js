const dayjs = require("dayjs");

const sortDays = (appointmentsDays) => {
  if (!appointmentsDays) return {};

  return Object.keys(appointmentsDays)
    .map((date) => dayjs(date, "DD-MM-YYYY"))
    .sort((a, b) => a.diff(b))
    .map((date) => date.format("DD-MM-YYYY"))
    .reduce((obj, key) => {
      obj[key] = appointmentsDays[key];
      return obj;
    }, {});
};

module.exports = sortDays;
