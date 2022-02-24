const { CronJob } = require('cron');
const TimetableUpdate = require('../logic/master/timetable/timetable-update/timetable-update');

const timetableUpdateJob = () =>
  new CronJob(
    '0 0 * * * *',
    () => {
      TimetableUpdate.update();
    },
    null,
    true,
    'Asia/Vladivostok'
  );
module.exports = timetableUpdateJob;
