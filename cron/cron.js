const appointmentToHistoryJob = require('./appointment-to-history-job');
const deleteUnconfirmedAccountsJob = require('./delete-unconfirmed-accounts-job');
const restoreAuthAttemptsJob = require('./restore-auth-attempts-job');
const restoreResetPasswordAttempts = require('./restore-reset-password-attempts-job');
const serviceUpdateJob = require('./service-update-job');
const timetableUpdateJob = require('./timetable-update-job');

const workingJobs = [];

const runCronJobs = () => {
  const jobsToExecute = [
    serviceUpdateJob,
    timetableUpdateJob,
    restoreAuthAttemptsJob,
    deleteUnconfirmedAccountsJob,
    appointmentToHistoryJob,
    restoreResetPasswordAttempts,
  ];

  for (const job of jobsToExecute) {
    const executedJob = job();
    workingJobs.push(executedJob);
  }
};

const stopCronJobs = () => {
  for (const job of workingJobs) {
    job.stop();
  }
};

module.exports = { runCronJobs, stopCronJobs };
