const { TIMETABLE } = require('../../../../config/collection-names');
const { INCORRECT_TIMETABLE } = require('../../../../config/errors/appointment');
const HttpError = require('../../../../models/utils/http-error');
const bookingData = require('../../../../pipelines/appointments/booking-data');
const { getAggregate } = require('../../../../utils/database');

class BookAppointment {
  static async getData(masterId, serviceId, date) {
    const aggregate = getAggregate(TIMETABLE);
    const pipeline = bookingData(masterId, serviceId, date);
    const data = await aggregate(pipeline).next();
    if (!data) throw new HttpError(INCORRECT_TIMETABLE, 404);
    return data;
  }
}

module.exports = BookAppointment;
