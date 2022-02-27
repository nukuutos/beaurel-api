const { APPOINTMENT, SERVICE } = require('../../../../config/collection-names');
const { INCORRECT_TIMETABLE } = require('../../../../config/errors/appointment');
const Appointment = require('../../../../models/appointment');
const Timetable = require('../../../../models/timetable');
const HttpError = require('../../../../models/utils/http-error');
const bookingData = require('../../../../pipelines/appointments/booking-data');
const { getAggregate } = require('../../../../utils/database');

class BookAppointment extends Appointment {
  static name = APPOINTMENT;

  static async getData(masterId, serviceId, date) {
    const aggregate = getAggregate(SERVICE);
    // get timetable
    const timetable = await Timetable.findOne({ masterId }, { _id: 0 });

    if (!timetable) throw new HttpError(INCORRECT_TIMETABLE, 404);

    const { timezone } = timetable;

    const formattedDate = date.toLocalTimeInUTC(timezone);

    // console.log(date.format(), date.toDate(), timezone);

    const pipeline = bookingData(masterId, serviceId, formattedDate.toDate());

    const data = await aggregate(pipeline).next();

    // console.log(masterId, serviceId, date, data.toDate());

    return { ...data, timetable, formattedDate };
  }
}

module.exports = BookAppointment;
