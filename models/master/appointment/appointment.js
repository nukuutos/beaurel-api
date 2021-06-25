const { getDb } = require('../../../utils/database');

const {
  toConfirmed,
  toUnsuitableByPossibleTime,
  toUnsuitableBySessionTime,
  toUnsuitableByWeekends,
  toUnsuitableByExceptions,
  toUnsuitableByAppointments,
} = require('./utils');

const masterAppointmentsAndCustomers = require('./pipelines/master-appointments-and-customers');
const customerAppointmentsAndMasters = require('./pipelines/customer-appointments-and-masters');
const bookingData = require('./pipelines/booking-data');

class Appointment {
  constructor(masterId, customerId, service, time, date) {
    this.masterId = masterId;
    this.customerId = customerId;
    this.service = service;
    this.time = time; // { startAt, endAt }
    this.status = 'onConfirmation'; // onConfirmation, confirmed, cancelled, ended/expired, unsuitable
    this.date = date;
    this.createdAt = new Date();
  }

  async save() {
    const db = getDb();
    await db.collection('appointments').insertOne(this);
  }

  static async getAppointmentsAsMaster(masterId, category) {
    const db = getDb();

    const appointments = await db
      .collection('appointments')
      .aggregate(masterAppointmentsAndCustomers(masterId, category))
      .toArray();

    return appointments;
  }

  static async getAppointmentsAsCustomer(customerId, category) {
    const db = getDb();

    const appointments = await db
      .collection('appointments')
      .aggregate(customerAppointmentsAndMasters(customerId, category))
      .toArray();

    return appointments;
  }

  static async findOne(query, projection = null) {
    const db = getDb();
    return await db.collection('appointments').findOne(query, { projection: projection });
  }

  static async updateOne(query, update) {
    const db = getDb();
    await db.collection('appointments').updateOne(query, { $set: update });
  }

  static async updateMany(query, update) {
    const db = getDb();
    await db.collection('appointments').updateMany(query, { $set: update });
  }

  static async toConfirmed(masterId, date) {
    const db = getDb();

    await db
      .collection('appointments')
      .updateMany({ masterId, date: { $gte: date } }, { $set: { status: 'confirmed' } });
  }

  // correct appointments by changes in timetable
  static async toUnsuitable(masterId, date, updatedTimetable, changes) {
    const db = getDb();
    const appointmentsCol = db.collection('appointments');

    // Init unodered bulk if we don't need return appointments' status back
    let batch = appointmentsCol.initializeUnorderedBulkOp({ useLegacyOps: true });

    const { auto, manually, sessionTime, type } = updatedTimetable;

    if (changes['sessionTime']) {
      // Appoinments to unsuitable by session time
      toUnsuitableBySessionTime(masterId, date, sessionTime, batch);
    }

    if (type === 'auto' && changes['type']) {
      toUnsuitableByPossibleTime(masterId, date, possibleAppointmentsTime, sessionTime, batch);
      toUnsuitableByWeekends(masterId, date, weekends, batch);
      toUnsuitableByExceptions(masterId, date, exceptions, batch);
    } else if (type === 'auto' && !changes['type']) {
      const { possibleAppointmentsTime, weekends, exceptions } = auto;

      if (changes['workingDay']) {
        // Appoinments to unsuitable by possible appointments times
        toUnsuitableByPossibleTime(masterId, date, possibleAppointmentsTime, sessionTime, batch);
      }

      // Appoinments to unsuitable by weeekends
      if (changes['weekends']) toUnsuitableByWeekends(masterId, date, weekends, batch);

      // Appoinments to unsuitable by exceptions
      if (changes['exceptions']) toUnsuitableByExceptions(masterId, date, exceptions, batch);
    } else if (type === 'manually' && (changes['type'] || changes['appointments'])) {
      const { appointments } = manually;

      toUnsuitableByAppointments(masterId, date, appointments, batch);
    }

    await batch.execute();
  }

  static async getInfoForBookingAppointment(masterId, serviceId, date) {
    const db = getDb();
    const data = await db // array
      .collection('timetables')
      .aggregate(bookingData(masterId, serviceId, date))
      .toArray();

    return data[0];
  }
}

module.exports = Appointment;
