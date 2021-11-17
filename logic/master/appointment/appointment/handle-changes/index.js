const getChanges = require('./get-changes');
const {
  handleSessionTimeChange,
  handleSwitchTypeToAuto,
  handleChangesInAutoTimetable,
  handleChangesInManuallyTimetable,
} = require('./handle-functions');

module.exports = (defaultParams, changes, updatedTimetable) => {
  const { auto, manually, sessionTime, type } = updatedTimetable;

  const { isSessionTime, isSwitchToAuto, isChangesInAutoTimetable, isChangesInManuallyTimetable } =
    getChanges(changes, type);

  if (isSessionTime) handleSessionTimeChange(defaultParams, sessionTime);

  if (isSwitchToAuto) {
    handleSwitchTypeToAuto(defaultParams, sessionTime, auto);
  } else if (isChangesInAutoTimetable) {
    handleChangesInAutoTimetable(defaultParams, sessionTime, changes, auto);
  } else if (isChangesInManuallyTimetable) {
    handleChangesInManuallyTimetable(defaultParams, manually);
  }
};
