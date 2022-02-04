const dayjs = require('dayjs');
const { APPOINTMENT } = require('../../../../config/collection-names');
const {
  INCORRECT_DURATION,
  INCORRECT_STATUS,
  INVALID_APPOINTMENT,
} = require('../../../../config/errors/appointment');
const HttpError = require('../../../../models/utils/http-error');
const unsuitableAppointmentData = require('../../../../pipelines/appointments/unsuitable-appointment-data');
const Booking = require('./booking-controllers/booking');

class UpdateUnsuitableAppointment extends Booking {
  static name = APPOINTMENT;

  constructor({ masterId, timetable, duration, appointment, date, time, bookedAppointments }) {
    super();

    this.masterId = masterId;
    this.timetable = timetable;
    this.duration = duration;
    this.appointment = appointment;
    this.date = date;
    this.time = time;
    this.bookedAppointments = bookedAppointments;
    this.createdAt = dayjs().toDate();
  }

  static async getData(masterId, appointmentId, date) {
    const pipeline = unsuitableAppointmentData({ masterId, appointmentId, date });
    const data = await this.aggregate(pipeline).next();
    if (!data.appointment) throw new HttpError(INVALID_APPOINTMENT, 404);
    return data;
  }

  checkDuration() {
    const { time, duration, timetable } = this;
    const { endAt, startAt } = time;

    const { sessionTime } = timetable;

    const isStartAndEndCorrect = endAt - startAt === duration;
    const isDurationCorrect = duration % sessionTime === 0;

    if (!isStartAndEndCorrect || !isDurationCorrect) {
      throw new HttpError(INCORRECT_DURATION, 400);
    }

    return this;
  }

  checkStatus() {
    const { status } = this.appointment;

    if (status !== 'unsuitable') {
      throw new HttpError(INCORRECT_STATUS, 400);
    }

    return this;
  }

  setIsViewed() {
    this.isViewed = { master: true, customer: false };
    return this;
  }

  async update() {
    const { appointment, masterId, duration, date, time, isViewed } = this;

    await UpdateUnsuitableAppointment.updateOne(
      { _id: appointment._id, masterId },
      { 'service.duration': duration, date: date.toDate(), isViewed, time, status: 'confirmed' }
    );
  }
}

module.exports = UpdateUnsuitableAppointment;
