const Dayjs = require('dayjs');

Dayjs.prototype.isTimeReseted = function () {
  // expect 00:00:00 +0
  const timeValues = [
    this.hour(),
    this.minute(),
    this.second(),
    this.millisecond(),
    this.utcOffset(),
  ];

  return timeValues.every((value) => value === 0);
};

Dayjs.prototype.getTodayUTC = function () {
  const offset = this.utcOffset();

  return this.add(offset, 'm').utcOffset(0).second(0).minute(0).hour(0);
};

Dayjs.prototype.toLocalTimeInUTC = function (timezone) {
  const date = this.tz(timezone);
  const offset = date.utcOffset();

  return date.utc().subtract(offset, 'minute');
};

Dayjs.prototype.utcNow = () => this.utc().toDate();
