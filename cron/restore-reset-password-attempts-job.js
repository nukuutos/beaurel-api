const { CronJob } = require('cron');
const Profile = require('../logic/profile/profile');

const restoreResetPasswordAttempts = () =>
  new CronJob(
    '0 0 */2 * * *',
    () => {
      Profile.restoreResetPasswordAttempts();
    },
    null,
    true,
    'Asia/Vladivostok'
  );
module.exports = restoreResetPasswordAttempts;
