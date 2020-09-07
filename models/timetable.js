const { getDb } = require('../utils/database');

const { getTimetableAndAppointmentsForUpdate } = require('./pipelines/timetable');

class Timetable {
  constructor(masterId, workingDay, sessionTime, weekends, possibleAppointmentsTime) {
    this.masterId = masterId;
    this.workingDay = workingDay;
    this.sessionTime = sessionTime;
    this.weekends = weekends;
    this.possibleAppointmentsTime = possibleAppointmentsTime;
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
    try {
      return await db.collection('users').findOne(query, { projection: projection });
    } catch (error) {
      throw new Error();
    }
  }

  static async updateOne(query, update) {
    const db = getDb();
    try {
      return await db.collection('timetables').updateOne(query, { $set: update });
    } catch (error) {
      throw new Error();
    }
  }

  // static async getTimetableAndAppointments(masterId, serviceId, date) {
  //   const db = getDb();
  //   try {
  //     const daySchedule = await db // array
  //       .collection('timetables')
  //       .aggregate([
  //         {
  //           $match: {
  //             masterId,
  //           },
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             masterId: 1,
  //             timetable: {
  //               workingDay: '$workingDay',
  //               sessionTime: '$sessionTime',
  //               weekends: '$weekends',
  //               possibleAppointmentsTime: '$possibleAppointmentsTime',
  //               update: '$update',
  //             },
  //           },
  //         },
  //         // get appointments
  //         {
  //           $lookup: {
  //             from: 'appointments',
  //             let: {
  //               masterId,
  //             },
  //             pipeline: [
  //               {
  //                 $match: {
  //                   status: { $ne: 'cancelled' },
  //                   $expr: {
  //                     $and: [
  //                       {
  //                         $eq: ['$masterId', '$$masterId'],
  //                       },
  //                       {
  //                         $eq: ['$date', new Date(date)],
  //                       },
  //                     ],
  //                   },
  //                 },
  //               },
  //               {
  //                 $project: {
  //                   _id: 0,
  //                   startAt: '$time.startAt',
  //                   endAt: '$time.endAt',
  //                 },
  //               },
  //             ],
  //             as: 'bookedAppointments',
  //           },
  //         },
  //         {
  //           $project: {
  //             _id: 0,
  //             masterId: 0,
  //             workingDay: 0,
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: 'services',
  //             let: {
  //               serviceId,
  //               masterId,
  //             },
  //             pipeline: [
  //               {
  //                 $match: {
  //                   $expr: {
  //                     $and: [
  //                       {
  //                         $eq: ['$_id', '$$serviceId'],
  //                       },
  //                       {
  //                         $eq: ['$masterId', '$$masterId'],
  //                       },
  //                     ],
  //                   },
  //                 },
  //               },
  //             ],
  //             as: 'service',
  //           },
  //         },
  //         {
  //           $addFields: {
  //             service: { $arrayElemAt: ['$service', 0] },
  //           },
  //         },
  //       ])
  //       .toArray();

  //     return daySchedule[0];
  //   } catch (error) {
  //     throw new Error();;
  //   }
  // }

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
