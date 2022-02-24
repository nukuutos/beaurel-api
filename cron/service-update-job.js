const { CronJob } = require('cron');
const UpdateService = require('../logic/master/service/update-service');

const serviceUpdateJob = () =>
  new CronJob(
    '0 0 0 * * *',
    () => {
      UpdateService.update();
    },
    null,
    true,
    'Asia/Vladivostok'
  );

module.exports = serviceUpdateJob;
