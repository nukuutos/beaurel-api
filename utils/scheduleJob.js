const CronJob = require('cron').CronJob;
const getDb = require('../utils/database').getDb;

exports.updateTimetableJob = new CronJob('0 0 0 * * *', async () => {
  const db = getDb();

  const date = new Date();
  console.log('tb At 00:00 Minutes:', date);
  date.setHours(0, 0, 0, 0);
  try {
    await db.collection('timetable').updateMany(
      { 'nextTimetable.date': date },
      {
        $set: {
          workingDay: '$nextTimetable.workingDay',
          sessionTime: '$nextTimetable.sessionTime',
          weekends: '$nextTimetable.weekends',
          possibleAppointmentsTime: '$nextTimetable.possibleAppointmentsTime',
          nextTimetable: null,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
});

exports.updateServiceJob = new CronJob('0 0 0 * * *', async () => {
  const db = getDb();

  const date = new Date();
  console.log('service At 00:00 Minutes:', date);
  date.setHours(0, 0, 0, 0);
  try {
    await db.collection('service').updateMany(
      { 'nextService.date': date },
      {
        $set: {
          title: '$nextService.title',
          parameter: '$nextService.parameter',
          duration: '$nextService.duration',
          price: '$nextService.price',
          nextService: null,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
});

exports.updateAppointmentJob = new CronJob('0 */5 * * * *', async () => {
  const db = getDb();

  const date = new Date();
  const midnigthDate = new Date(date);
  midnigthDate.setHours(0, 0, 0, 0);

  const msSinceMidnight = date - midnigthDate;

  console.log('Appointments are updated');
  // date.setHours(0, 0, 0, 0);
  try {
    await db
      .collection('appointment')
      .updateMany(
        { date: { $lte: date }, 'time.startAt': { $lte: msSinceMidnight }, status: { $ne: 'expired' } },
        { $set: { status: 'expired' } }
      );
  } catch (error) {
    console.error(error);
  }
});
