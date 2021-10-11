const dayjs = require("dayjs");

const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const weekday = require("dayjs/plugin/weekday");

const en = require("dayjs/locale/en");

dayjs.locale({
  ...en,
  weekStart: 1,
});

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);
dayjs.extend(customParseFormat);
