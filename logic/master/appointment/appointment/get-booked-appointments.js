const dayjs = require('dayjs');
const { getBookedAppointmentsCacheName } = require('../../../../config/cache');
const { APPOINTMENT } = require('../../../../config/collection-names');
const { NO_TIMETABLE } = require('../../../../config/errors/timetable');
const Appointment = require('../../../../models/appointment');
const Timetable = require('../../../../models/timetable');
const HttpError = require('../../../../models/utils/http-error');
const bookedAppointments = require('../../../../pipelines/appointments/booked-appointments');
const { getFormattedAppointments } = require('../../../profile/appointment/utils');

class GetBookedAppointments extends Appointment {
  static name = APPOINTMENT;

  static async getData(masterId, date) {
    const timetable = await Timetable.findOne({ masterId }, { _id: 0, timezone: 1 });
    if (!timetable) throw new HttpError(NO_TIMETABLE, 404);

    const { timezone } = timetable;
    const startDate = date.toLocalTimeInUTC(timezone).toDate();
    const endDate = date.toLocalTimeInUTC(timezone).add(4, 'week').toDate();

    const firstCacheKey = getBookedAppointmentsCacheName(masterId);
    const secondCacheKey = date.format();
    const weekTTL = 60 * 60 * 24 * 7;

    const pipeline = bookedAppointments({ masterId, startDate, endDate });
    const data = await this.cache(firstCacheKey, secondCacheKey, weekTTL)
      .aggregate(pipeline)
      .toArray();

    const formattedAppointments = getFormattedAppointments(data);

    return formattedAppointments;
  }
}

module.exports = GetBookedAppointments;
