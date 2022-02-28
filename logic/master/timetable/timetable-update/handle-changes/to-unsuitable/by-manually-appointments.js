const dayjs = require('dayjs');
const { find } = require('./utils');

const createPipeline = (appointments, historyRecord) => [
  {
    $addFields: {
      dayOfWeek: { $subtract: [{ $dayOfWeek: '$date' }, 1] }, // to indexes
      appointments: { $objectToArray: appointments },
    },
  },
  {
    $addFields: {
      day: { $arrayElemAt: ['$appointments', '$dayOfWeek'] },
    },
  },
  {
    $set: {
      status: {
        $cond: {
          if: { $not: { $in: ['$time.startAt', '$day.v'] } },
          then: 'unsuitable',
          else: '$status',
        },
      },
      history: {
        $cond: {
          if: { $not: { $in: ['$time.startAt', '$day.v'] } },
          then: { $concatArrays: ['$history', [historyRecord]] },
          else: '$history',
        },
      },
    },
  },
  {
    $project: {
      dayOfWeek: 0,
      appointments: 0,
      day: 0,
    },
  },
];

// change exception keys for date format in mongodb
const formatWeekObjectForMongodb = (object) => {
  const weekdays = Object.keys(object);
  const values = Object.values(object);

  const formatedWeekdays = weekdays.map((weekday) => ((Number(weekday) + 1) % 7) + 1);

  const result = {};

  for (let i = 0; i < 7; i++) {
    const key = formatedWeekdays[i];
    const value = values[i];

    result[key] = value;
  }

  return result;
};

module.exports = (defaultParams, appointments) => {
  const { bulkOp, masterId, date } = defaultParams;

  const findQuery = find(masterId, date);

  const formatedAppointments = formatWeekObjectForMongodb(appointments);

  const historyDate = dayjs().utc().toDate();
  const historyRecord = { user: 'server', status: 'unsuitable', date: historyDate };

  const pipeline = createPipeline(formatedAppointments, historyRecord);

  bulkOp.aggregationUpdate(findQuery, pipeline);
};
