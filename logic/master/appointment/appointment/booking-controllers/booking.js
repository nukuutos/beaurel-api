const dayjs = require('dayjs');
const { APPOINTMENT } = require('../../../../../config/collection-names');
const {
  INCORRECT_SERVICE,
  INCORRECT_DURATION,
  UNSUITABLE_SERVICE,
} = require('../../../../../config/errors/appointment');
const { BOOK_APPOINTMENT_BY_CUSTOMER } = require('../../../../../config/socket-io/types');
const User = require('../../../../../models/user');
const Collection = require('../../../../../models/utils/collection/collection');
const HttpError = require('../../../../../models/utils/http-error');
const { getIO } = require('../../../../../utils/socket');

const { IS_SOCKET_IO } = process.env;

class Booking extends Collection {
  static name = APPOINTMENT;

  constructor(
    { customerId, timetable, service, date, time, bookedAppointments, formattedDate } = {
      customerId: null,
    }
  ) {
    super();

    this.customerId = customerId;
    this.timetable = timetable;
    this.service = service;
    this.date = date;
    this.formattedDate = formattedDate;
    this.time = time;
    this.bookedAppointments = bookedAppointments;
    this.status = 'onConfirmation';
    this.history = [{ user: 'customer', status: 'onConfirmation', date: dayjs().utc().toDate() }];
    this.createdAt = dayjs().toDate();
  }

  isService() {
    if (!this.service) throw new HttpError(INCORRECT_SERVICE, 404);
    return this;
  }

  getWorkingTimetable() {
    const { timetable, date: bookingDate } = this;

    const { update, ...currentTimetable } = timetable;

    let workingTimetable = { ...currentTimetable };

    if (!update?.date) {
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

    if (!update?.date) {
      this.service = currentService;
      return this;
    }

    const updateDate = dayjs(update.date);

    if (updateDate.isBefore(bookingDate) && update.status === 'unsuitable') {
      throw new HttpError(UNSUITABLE_SERVICE, 400);
    }

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

  getCorrectStatus() {
    const { customerId } = this;
    const { masterId } = this.service;

    const stringMasterId = masterId.toString();
    const stringCustomerId = customerId.toString();

    if (stringMasterId === stringCustomerId) {
      this.status = 'confirmed';
      this.history = [{ user: 'master', status: 'confirmed', date: dayjs().utc().toDate() }];
    }

    return this;
  }

  setIsViewed() {
    const { customerId } = this;
    const { masterId } = this.service;

    const stringMasterId = masterId.toString();
    const stringCustomerId = customerId.toString();

    this.isViewed = { customer: true, master: false };

    if (stringMasterId === stringCustomerId) {
      this.isViewed.master = false;
    }

    return this;
  }

  createAppointment() {
    const { time, customerId, createdAt, history, status, isViewed, formattedDate } = this;
    const { _id, masterId, ...service } = this.service;

    const appointment = {
      masterId,
      customerId,
      service,
      time,
      createdAt,
      history,
      status,
      isViewed,
      date: formattedDate.toDate(),
    };

    this.appointment = appointment;

    return this;
  }

  async save() {
    const { appointment } = this;
    const { insertedId } = await Booking.save(appointment);
    this.appointment._id = insertedId;
  }

  async sendAppointmentToClient() {
    if (!IS_SOCKET_IO) return this;

    const { customerId } = this;
    const { masterId } = this.service;

    const stringMasterId = masterId.toString();
    const stringCustomerId = customerId.toString();

    if (stringMasterId === stringCustomerId) return this;

    // get customer
    const user = await User.findOne(
      { _id: customerId },
      { role: 1, username: 1, firstName: 1, lastName: 1, avatar: 1 }
    );

    const io = getIO();

    const { appointment } = this;
    const { customerId: something, history, ...appointmentData } = appointment;

    const status = { status: 'onConfirmation', user: 'customer' };

    io.emit(stringMasterId, {
      type: BOOK_APPOINTMENT_BY_CUSTOMER,
      payload: { appointment: { ...appointmentData, status, user, isSocket: true } },
    });

    return this;
  }
}

module.exports = Booking;
