const TimetableUpdate = require('../../../logic/master/timetable/timetable-update/timetable-update');
const Timetable = require('../../../models/timetable');
const cronTimetables = require('./cron-timetables');
const { before, after } = require('../../utils/endpoint-test-preparation');

describe(`Cron update timetables`, () => {
  before();

  it('should successfully update timetables', async () => {
    await Timetable.insertMany(cronTimetables);

    await TimetableUpdate.update();

    const timetables = await Timetable.find({ update: null });

    expect(timetables).toHaveLength(2);
    expect(timetables[0].sessionTime).toBe(90);
  });

  after();
});
