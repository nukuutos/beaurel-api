const { CronJob } = require('cron');
const Profile = require('../logic/profile/profile');

const restoreAuthAttemptsJob = () =>
  new CronJob(
    '0 0 */2 * * *',
    () => {
      Profile.restoreAttempts();
    },
    null,
    true,
    'Asia/Vladivostok'
  );
module.exports = restoreAuthAttemptsJob;
