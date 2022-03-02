const { CronJob } = require('cron');
const Appointment = require('../logic/profile/appointment/appointment');

const appointmentToHistoryJob = () =>
  new CronJob(
    '0 */30 * * * *',
    () => {
      Appointment.toHistory();
    },
    null,
    true,
    'Asia/Vladivostok'
  );
module.exports = appointmentToHistoryJob;
