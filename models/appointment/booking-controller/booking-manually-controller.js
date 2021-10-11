const { APPOINTMENT } = require("../../../config/collection-names");
const { UNAVAILABLE_TIME, INCORRECT_TIME } = require("../../../config/errors/appointment");
const HttpError = require("../../utils/http-error");
const BookingController = require("./booking-controller");

class BookingManuallyController extends BookingController {
  static name = APPOINTMENT;

  constructor(appointment) {
    super(appointment);
  }

  checkAvailability() {
    const { freeAppointmentTimes, timetable, time } = this;

    const { sessionTime } = timetable;
    const { startAt, endAt } = time;

    for (let i = startAt; i < endAt; i += sessionTime) {
      if (!freeAppointmentTimes.includes(i)) throw new HttpError(UNAVAILABLE_TIME, 400);
    }

    return this;
  }

  isTimeExist() {
    const { manually, date } = this.timetable;
    const { appointments } = manually;

    const weekday = date.weekday();
    if (!appointments[weekday].includes(startAt)) {
      throw new HttpError(INCORRECT_TIME, 400);
    }

    return this;
  }

  checkAvailability() {
    const { bookedAppointments, time } = this;
    const { startAt, endAt } = time;

    for (let i = 0; i < bookedAppointments.length; i++) {
      const bookedAppointment = bookedAppointments[i];

      // is Current Appointment Before Booked Appointment
      const isBefore = startAt < bookedAppointment.startAt && endAt <= bookedAppointment.startAt;
      // is Current Appointment After Booked Appointment
      const isAfter = startAt >= bookedAppointment.endAt && endAt < bookedAppointment.endAt;

      // if current appointment is crossing booked appointment => error
      if (!isBefore || !isAfter) throw new HttpError(UNAVAILABLE_TIME, 400);
    }

    return this;
  }
}

module.exports = BookingManuallyController;
