const { APPOINTMENT } = require("../../../config/collection-names");
const {
  WEEKEND,
  EXCEPTION,
  MORE_THAN_MAX,
  UNAVAILABLE_TIME,
} = require("../../../config/errors/appointment");
const HttpError = require("../../utils/http-error");
const BookingController = require("./booking-controller");

class BookingAutoController extends BookingController {
  static name = APPOINTMENT;

  constructor(appointment) {
    super(appointment);
  }

  isWeekend() {
    const { date, timetable } = this;
    const { auto } = timetable;
    const { weekends } = auto;

    const weekday = date.weekday();

    if (weekends.includes(weekday)) throw new HttpError(WEEKEND, 400);

    return this;
  }

  isException() {
    const { timetable, time, date } = this;

    const { auto } = timetable;
    const { exceptions } = auto;

    const { startAt } = time;

    const weekday = date.weekday();

    const dayExceptions = exceptions[weekday];

    if (dayExceptions.includes(startAt)) throw new HttpError(EXCEPTION, 400);

    return this;
  }

  isOverWorkingDay() {
    const {
      timetable: { auto, sessionTime },
      time: { endAt },
    } = this;

    const { possibleAppointmentsTime } = auto;

    const lastPossibleAppointment = possibleAppointmentsTime[possibleAppointmentsTime.length - 1];
    const lastPossibleAppointmentEndTime = lastPossibleAppointment + sessionTime;

    if (endAt > lastPossibleAppointmentEndTime) {
      throw new HttpError(MORE_THAN_MAX, 400);
    }
    return this;
  }

  getFreeAppointments() {
    const {
      bookedAppointments,
      timetable: { auto, sessionTime },
    } = this;

    const { possibleAppointmentsTime } = auto;

    const freeAppointmentTimes = [...possibleAppointmentsTime];
    const bookedAppointmentsCount = bookedAppointments.length;

    for (let i = 0; i < bookedAppointmentsCount; i++) {
      const bookedTime = bookedAppointments[i];
      const { startAt, endAt } = bookedTime;

      const startIndex = freeAppointmentTimes.indexOf(startAt);
      const deleteCount = (endAt - startAt) / sessionTime;
      freeAppointmentTimes.splice(startIndex, deleteCount);
    }

    this.freeAppointmentTimes = freeAppointmentTimes;

    return this;
  }

  checkAvailability() {
    const {
      freeAppointmentTimes,
      timetable: { sessionTime },
      time: { startAt, endAt },
    } = this;

    for (let i = startAt; i < endAt; i += sessionTime) {
      if (!freeAppointmentTimes.includes(i)) throw new HttpError(UNAVAILABLE_TIME, 400);
    }

    return this;
  }
}

module.exports = BookingAutoController;
