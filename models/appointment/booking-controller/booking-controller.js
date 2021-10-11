const dayjs = require("dayjs");
const { APPOINTMENT } = require("../../../config/collection-names");
const {
  INCORRECT_TIMETABLE,
  INCORRECT_SERVICE,
  INCORRECT_DURATION,
} = require("../../../config/errors/appointment");
const Collection = require("../../utils/collection/collection");
const HttpError = require("../../utils/http-error");

class BookingController extends Collection {
  static name = APPOINTMENT;

  constructor({ customerId, timetable, service, date, time, bookedAppointments }) {
    super();

    this.customerId = customerId;
    this.timetable = timetable;
    this.service = service;
    this.date = date;
    this.time = time;
    this.bookedAppointments = bookedAppointments;
    this.status = "onConfiramtion";
    this.createdAt = dayjs().toDate();
  }

  isTimetable() {
    if (!this.timetable) throw new HttpError(INCORRECT_TIMETABLE, 404);
    return this;
  }

  isService() {
    if (!this.service) throw new HttpError(INCORRECT_SERVICE, 404);
    return this;
  }

  getWorkingTimetable() {
    const { timetable, date: bookingDate } = this;

    const { update, ...currentTimetable } = timetable;

    let workingTimetable = { ...currentTimetable };

    if (!update.date) {
      this.timetable = workingTimetable;
      return this;
    }

    const updateDate = dayjs(update.date);

    if (updateDate.isBefore(bookingDate)) workingTimetable = { ...update };

    this.timetable = workingTimetable;

    return this;
  }

  getWorkingService() {
    const { service, date: bookingDate } = this;

    const { update, ...currentService } = service;

    if (!update.date) {
      this.service = currentService;
      return this;
    }

    const updateDate = dayjs(update.date);

    if (updateDate.isBefore(bookingDate)) {
      this.service.duration = update.duration;
    }

    return this;
  }

  checkDuration() {
    const { time, service, timetable } = this;
    const { endAt, startAt } = time;

    const { duration } = service;
    const { sessionTime } = timetable;

    const isStartAndEndCorrect = endAt - startAt === duration;
    const isDurationCorrect = duration % sessionTime === 0;

    if (!isStartAndEndCorrect || !isDurationCorrect) {
      throw new HttpError(INCORRECT_DURATION, 400);
    }

    return this;
  }

  createAppointment() {
    const { time, customerId, createdAt, status, date: bookingDate } = this;
    const { _id, masterId, ...service } = this.service;

    const appointment = {
      masterId,
      customerId,
      service,
      time,
      createdAt,
      status,
      date: bookingDate.toDate(),
    };

    this.appointment = appointment;

    return this;
  }

  async save() {
    const { appointment } = this;
    await BookingController.save(appointment);
  }
}

module.exports = BookingController;
