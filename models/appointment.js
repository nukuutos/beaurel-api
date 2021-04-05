const { getDb } = require('../utils/database');

const {
  toConfirmed,
  toUnsuitableByPossibleTime,
  toUnsuitableBySessionTime,
  toUnsuitableByWeekends,
} = require('./utils/appointment');

const masterAppointmentsAndCustomers = require('./pipelines/appointments/master-appointments-and-customers');

const masters = require('./pipelines/user/masters');
const customerAppointmentsAndMasters = require('./pipelines/appointments/customer-appointments-and-masters');

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
  // static async find(query, projection = null) {
  //   const db = getDb();
  //   const appointments = await db.collection('appointments').find(query, { projection: projection }).toArray();
  //   return appointments;
  // }

  static async updateOne(query, update) {
    const db = getDb();
    await db.collection('appointments').updateOne(query, { $set: update });
  }

  static async toConfirmed(masterId, date) {
    const db = getDb();

    await db
      .collection('appointments')
      .updateMany({ masterId, date: { $gte: date } }, { $set: { status: 'confirmed' } });
  }

  // correct appointments by changes in timetable
  static async correctByTimetableChanges(masterId, date, timetable, changes) {
    const db = getDb();
    const appointmentsCol = db.collection('appointments');

    const { isWorkingDayChanged, isSessionTimeChanged, isWeekendsChanged, isTimetableUpdateChanges } = changes;

    // Init unodered bulk if we don't need return appointments' status back
    let batch = appointmentsCol.initializeUnorderedBulkOp({ useLegacyOps: true });

    if (isTimetableUpdateChanges) {
      // Init odered bulk if we need return appointments' status back
      batch = appointmentsCol.initializeOrderedBulkOp();
      // Return appointments' status back
      toConfirmed(masterId, date, batch);
    }

    const { possibleAppointmentsTime, sessionTime, weekends } = timetable;

    if (isSessionTimeChanged) {
      // Appoinments to unsuitable by session time
      toUnsuitableBySessionTime(masterId, date, sessionTime, batch);
    }

    if (isWorkingDayChanged) {
      // Appoinments to unsuitable by possible appointments times
      toUnsuitableByPossibleTime(masterId, date, possibleAppointmentsTime, sessionTime, batch);
    }

    // Appoinments to unsuitable by weeekends
    if (isWeekendsChanged) toUnsuitableByWeekends(masterId, date, weekends, batch);

    await batch.execute();
  }
}

module.exports = Appointment;
