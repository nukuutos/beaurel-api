const dayjs = require('dayjs');
const cloneDeep = require('lodash.clonedeep');
const Service = require('../../../../models/service');
const Timetable = require('../../../../models/timetable');
const User = require('../../../../models/user');
const master = require('../../masters/master');
const unsuitableService = require('../../services/unsuitable-service');
const autoTimetableWithUpdate = require('../../timetables/auto-timetable-with-update');

const timetable = cloneDeep(autoTimetableWithUpdate);
const service = cloneDeep(unsuitableService);

service.update.date = dayjs().startOf('day').utc().toDate();
timetable.update.date = dayjs().startOf('day').utc().toDate();

const addDataForBookWithExpiredUnsuitableService = async () => {
  await Timetable.save(timetable);
  await Service.save(service);
  await User.save(master);
  return null;
};

module.exports = addDataForBookWithExpiredUnsuitableService;
