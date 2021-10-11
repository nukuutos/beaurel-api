const Dayjs = require("dayjs");

Dayjs.prototype.isReseted = function () {
  // expect 00:00:00 +0
  const [hour, minute, second, utcOffset] = [
    this.hour(),
    this.minute(),
    this.second(),
    this.utcOffset(),
  ];

  return hour === 0 && minute === 0 && second === 0 && utcOffset === 0;
};

Dayjs.prototype.getTodayUTC = function () {
  const offset = this.utcOffset();

  return this.add(offset, "m").utcOffset(0).second(0).minute(0).hour(0);
};

Dayjs.prototype.toLocalTimeInUTC = function (timezone) {
  const date = this.tz(timezone);
  const offset = date.utcOffset();

  return date.utcOffset(0).subtract(offset, "minute");
};

Dayjs.prototype.utcNow = () => this.utc().toDate();
