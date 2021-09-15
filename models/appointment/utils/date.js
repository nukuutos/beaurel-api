const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);
dayjs.extend(utc);

exports.sortDays = (appointmentsDays) => {
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

exports.utcNow = () => dayjs().utc().toDate();
