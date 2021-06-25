const { getDb } = require('../../../utils/database');

const { getTimetableAndAppointmentsForUpdate } = require('./pipelines/timetable-and-appointments-update');
const timetableAndAppointments = require('./pipelines/timetable-and-appointments');

// sturture
// const timetable = {
//   sessionTime: 60,
//   type: 'auto',
//   auto: {
//     weekends: ['5', '6'],
//     workingDay: {
//       startAt: 600,
//       endAt: 1020,
//     },
//     exceptions: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, // from 0=mon to 6=sun
//   },
//   manually: {
//     appointments: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, // from 0=mon to 6=sun
//   },
//   update: {
//     date: null,
//     same what above
// };

class Timetable {
  constructor(masterId, workingDay, sessionTime, weekends, possibleAppointmentsTime, type, exceptions, appointments) {
    this.masterId = masterId;

    this.sessionTime = sessionTime;

    this.type = type;

    this.auto = {
      weekends,
      workingDay,
      exceptions, // { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, from 0=mon to 6=sun
      possibleAppointmentsTime,
    };

    this.manually = {
      appointments, // { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }, from 0=mon to 6=sun
    };

    this.update = null;
  }

  async save() {
    const db = getDb();
    try {
      await db.collection('timetables').insertOne(this);
    } catch (error) {
      throw new Error();
    }
  }

  static async findOne(query, projection = null) {
    const db = getDb();
    return await db.collection('timetables').findOne(query, { projection: projection });
  }

  static async updateOne(query, update) {
    const db = getDb();
    return await db.collection('timetables').updateOne(query, { $set: update });
  }

  static async getTimetableAndAppointments(masterId) {
    const db = getDb();
    const resp = await db.collection('timetables').aggregate(timetableAndAppointments(masterId)).toArray();
    console.log(resp);
    return resp[0];
  }

  static async getTimetableAndAppointmentsForUpdate(masterId, appointmentId, date) {
    const db = getDb();
    try {
      const daySchedule = await db // array
        .collection('timetables')
        .aggregate(getTimetableAndAppointmentsForUpdate(masterId, appointmentId, date))
        .toArray();

      return daySchedule[0];
    } catch (error) {
      throw new Error();
    }
  }
}

module.exports = Timetable;
