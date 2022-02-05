const { TIMETABLE } = require('../../../config/collection-names');
const { NO_TIMEZONE, TIMETABLE_IS_EXISTED } = require('../../../config/errors/timetable');
const User = require('../../../models/user');
const HttpError = require('../../../models/utils/http-error');
const { createTimetableData } = require('../../../pipelines/timetable/create-timetable-data');

class CreateTimetable {
  constructor({ timezone = null, timetableId = null }) {
    this.timezone = timezone;
    this.timetableId = timetableId;
  }

  static async getData(masterId) {
    const pipeline = createTimetableData(masterId);
    const data = await User.aggregate(pipeline).next();
    return new this(data || {});
  }

  isTimetable() {
    if (this.timetableId) throw new HttpError(TIMETABLE_IS_EXISTED, 400);
    return this;
  }

  isTimezone() {
    if (!this.timezone) throw new HttpError(NO_TIMEZONE, 400);
    return this;
  }
}

module.exports = CreateTimetable;
