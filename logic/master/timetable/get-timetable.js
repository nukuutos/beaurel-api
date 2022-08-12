const dayjs = require('dayjs');
const { getBookedAppointmentsCacheName } = require('../../../config/cache');
const { TIMETABLE, APPOINTMENT } = require('../../../config/collection-names');
const { NO_TIMETABLE, END_DAY_TIME_REQUIRED } = require('../../../config/errors/timetable');
const Appointment = require('../../../models/appointment');
const Timetable = require('../../../models/timetable');
const HttpError = require('../../../models/utils/http-error');
const bookedAppointments = require('../../../pipelines/appointments/booked-appointments');
const timetableDataForBooking = require('../../../pipelines/timetable/timetable-data-for-booking');
const { getFormattedAppointments } = require('../../profile/appointment/utils');

class GetTimetable extends Timetable {
  static name = TIMETABLE;

  static async getData(masterId) {
    const timetablePipeline = timetableDataForBooking(masterId);

    const timetableData = await Timetable.aggregate(timetablePipeline).next();
    if (!timetableData) return { timetable: null, appointments: [], isServices: false };

    const { timezone } = timetableData;
    const date = dayjs().startOf('week').utc(true).toLocalTimeInUTC(timezone);
    const startDate = date.toDate();
    const endDate = date.add(4, 'week').toDate();

    const firstCacheKey = getBookedAppointmentsCacheName(masterId);
    const secondCacheKey = dayjs(startDate).utc(true).format();
    const weekTTL = 60 * 60 * 24 * 7;

    const bookedAppointmentsPipeline = bookedAppointments({ masterId, startDate, endDate });

    const data = await Appointment.cache(firstCacheKey, secondCacheKey, weekTTL)
      .aggregate(bookedAppointmentsPipeline)
      .toArray();

    const formattedAppointments = getFormattedAppointments(data);
    return { ...timetableData, appointments: formattedAppointments };
  }
}

module.exports = GetTimetable;
