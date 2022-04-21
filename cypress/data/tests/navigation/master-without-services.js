const cloneDeep = require('lodash.clonedeep');
const Timetable = require('../../../../models/timetable');
const User = require('../../../../models/user');
const master = require('../../masters/master');
const autoTimetable = require('../../timetables/auto-timetable');

const masterWithoutServices = cloneDeep(master);
masterWithoutServices.tools.isServices = false;

const addMasterWithoutServices = async () => {
  await User.save(masterWithoutServices);
  await Timetable.save(autoTimetable);
  return null;
};

module.exports = addMasterWithoutServices;
