const { TIMETABLE_AND_APPOINTMENTS } = require('../../../config/cache');
const { TIMETABLE } = require('../../../config/collection-names');
const { NO_TIMETABLE } = require('../../../config/errors/timetable');
const Timetable = require('../../../models/timetable');
const HttpError = require('../../../models/utils/http-error');
const timetableAndAppointments = require('../../../pipelines/timetable/timetable-and-appointments');

class GetTimetable extends Timetable {
  static name = TIMETABLE;

  static async getData(masterId) {
    const pipeline = timetableAndAppointments(masterId);
    const data = await this.aggregate(pipeline).cache(masterId, TIMETABLE_AND_APPOINTMENTS).next();

    if (!data) throw new HttpError(NO_TIMETABLE, 404);

    return data;
  }
}

module.exports = GetTimetable;
