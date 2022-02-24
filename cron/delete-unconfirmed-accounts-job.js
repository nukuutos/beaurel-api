const { CronJob } = require('cron');
const Profile = require('../logic/profile/profile');

const deleteUnconfirmedAccountsJob = () =>
  new CronJob(
    '0 0 0 * * *',
    () => {
      Profile.deleteUnconfirmedAccounts();
    },
    null,
    true,
    'Asia/Vladivostok'
  );
module.exports = deleteUnconfirmedAccountsJob;
