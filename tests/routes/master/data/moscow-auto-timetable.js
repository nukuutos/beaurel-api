const cloneDeep = require('lodash.clonedeep');
const autoTimetable = require('./auto-timetable');
const moscowMaster = require('./moscow-master');

const moscowAutoTimetable = cloneDeep(autoTimetable);
moscowAutoTimetable.masterId = moscowMaster._id;
moscowAutoTimetable.timezone = 'Europe/Moscow';

module.exports = moscowAutoTimetable;
