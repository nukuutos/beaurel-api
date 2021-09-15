const getChanges = require("./get-changes");

const {
  handleSessionTimeChange,
  handleSwitchTypeToAuto,
  handleChangesInAutoTimetable,
  handleChangesInManuallyTimetable,
} = require("./handle-functions");

module.exports = (defaultParams, changes, updatedTimetable) => {
  const { auto, manually, sessionTime, type } = updatedTimetable;

  const {
    isSessionTime,
    isSwitchToAuto,
    isChangesInAutoTimetable,
    isChangesInManuallyTimetable,
  } = getChanges(change, type);

  if (isSessionTime) handleSessionTimeChange(defaultParams);

  if (isSwitchToAuto) {
    handleSwitchTypeToAuto(defaultParams, sessionTime, auto);
  } else if (isChangesInAutoTimetable) {
    handleChangesInAutoTimetable(defaultParams, sessionTime, changes, auto);
  } else if (isChangesInManuallyTimetable) {
    handleChangesInManuallyTimetable(defaultParams, manually);
  }
};
