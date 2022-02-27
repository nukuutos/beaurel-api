const { CronJob } = require('cron');
const Appointment = require('../logic/profile/appointment/appointment');

const deleteUnconfirmedAccountsJob = () =>
  new CronJob(
    '0 */30 * * * *',
    () => {
      Appointment.toHistory();
    },
    null,
    true,
    'Asia/Vladivostok'
  );
module.exports = deleteUnconfirmedAccountsJob;
