const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const { getAggregate } = require("../../utils/database");
const { APPOINTMENT, TIMETABLE } = require("../../config/collection-names");

const {
  toConfirmed,
  toUnsuitableByPossibleTime,
  toUnsuitableBySessionTime,
  toUnsuitableByWeekends,
  toUnsuitableByExceptions,
  toUnsuitableByAppointments,
} = require("./utils");

const masterAppointmentsAndCustomers = require("../../pipelines/appointments/master-appointments-and-customers");
const customerAppointmentsAndMasters = require("../../pipelines/appointments/customer-appointments-and-masters");
const bookingData = require("../../pipelines/appointments/booking-data");
const Collection = require("../utils/collection/collection");

dayjs.extend(utc);

const sortDays = (appointmentsDays) =>
  Object.keys(appointmentsDays)
    .map((date) => dayjs(date, "DD-MM-YYYY"))
    .sort((a, b) => a.diff(b))
    .map((date) => date.format("DD-MM-YYYY"))
    .reduce((obj, key) => {
      obj[key] = appointmentsDays[key];
      return obj;
    }, {});

class Appointment extends Collection {
  static name = APPOINTMENT;

  constructor(masterId, customerId, service, time, date) {
    super();

    this.masterId = masterId;
    this.customerId = customerId;
    this.service = service;
    this.time = time; // { startAt, endAt }
    this.status = "onConfirmation"; // onConfirmation, confirmed, cancelled, ended/expired, unsuitable
    this.date = date;
    this.createdAt = dayjs().utc().toDate();
  }

  static async getAppointmentsAsMaster(masterId, category) {
    const pipeline = masterAppointmentsAndCustomers(masterId, category);

    const data = await this.aggregate(pipeline).next();

    const appointments = data ? data : {};

    const sortedAppointments = sortDays(appointments);

    return sortedAppointments;
  }

  static async getAppointmentsAsCustomer(customerId, category) {
    const pipeline = customerAppointmentsAndMasters(customerId, category);

    const data = await this.aggregate(pipeline).next();

    const appointments = data ? data : {};

    const sortedAppointments = sortDays(appointments);

    return sortedAppointments;
  }

  static async toConfirmed(masterId, date) {
    const query = { masterId, date: { $gte: date } };
    const update = { status: "confirmed" };
    await this.updateMany(query, update);
  }

  // correct appointments by changes in timetable
  static async toUnsuitable(masterId, date, updatedTimetable, changes) {
    // Init unodered bulk if we don't need return appointments' status back
    let batch = this.unorderedBulkOp({ useLegacyOps: true });

    const { auto, manually, sessionTime, type } = updatedTimetable;

    if (changes["sessionTime"]) {
      // Appoinments to unsuitable by session time
      toUnsuitableBySessionTime(masterId, date, sessionTime, batch);
    }

    if (type === "auto" && changes["type"]) {
      toUnsuitableByPossibleTime(masterId, date, possibleAppointmentsTime, sessionTime, batch);
      toUnsuitableByWeekends(masterId, date, weekends, batch);
      toUnsuitableByExceptions(masterId, date, exceptions, batch);
    } else if (type === "auto" && !changes["type"]) {
      const { possibleAppointmentsTime, weekends, exceptions } = auto;

      if (changes["workingDay"]) {
        // Appoinments to unsuitable by possible appointments times
        toUnsuitableByPossibleTime(masterId, date, possibleAppointmentsTime, sessionTime, batch);
      }

      // Appoinments to unsuitable by weeekends
      if (changes["weekends"]) toUnsuitableByWeekends(masterId, date, weekends, batch);

      // Appoinments to unsuitable by exceptions
      if (changes["exceptions"]) toUnsuitableByExceptions(masterId, date, exceptions, batch);
    } else if (type === "manually" && (changes["type"] || changes["appointments"])) {
      const { appointments } = manually;

      toUnsuitableByAppointments(masterId, date, appointments, batch);
    }

    await batch.execute();
  }

  static async getInfoForBookingAppointment(masterId, serviceId, date) {
    const aggregate = getAggregate(TIMETABLE);
    const pipeline = bookingData(masterId, serviceId, date);
    return await aggregate(pipeline).next();
  }
}

module.exports = Appointment;
