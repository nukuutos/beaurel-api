const dayjs = require('dayjs');
const { find } = require('./utils');

// mongodb      |   app
// sun    sat   |   sun    sat
//  1 --- 7     |    6 --- 5 / + 1
//                   7 --- 6 / % 7
//                   0 --- 6 / + 1
//                   1 --- 7

const createPipeline = (exceptions, historyRecord) => [
  {
    $addFields: {
      dayOfWeek: { $subtract: [{ $dayOfWeek: '$date' }, 1] }, // to indexes,
      exceptions: { $objectToArray: exceptions },
    },
  },
  {
    $addFields: {
      day: { $arrayElemAt: ['$exceptions', '$dayOfWeek'] },
    },
  },
  {
    $set: {
      status: {
        $cond: {
          if: { $in: ['$time.startAt', '$day.v'] },
          then: 'unsuitable',
          else: '$status',
        },
      },
      history: {
        $cond: {
          if: { $in: ['$time.startAt', '$day.v'] },
          then: { $concatArrays: ['$history', [historyRecord]] },
          else: '$history',
        },
      },
    },
  },
  {
    $project: {
      dayOfWeek: 0,
      exceptions: 0,
      day: 0,
    },
  },
];

// change exception keys for date format in mongodb
const formatWeekObjectForMongodb = (object) => {
  const weekdays = Object.keys(object);
  const exceptions = Object.values(object);

  const formatedWeekdays = weekdays.map((weekday) => ((Number(weekday) + 1) % 7) + 1);

  const result = {};

  for (let i = 0; i < 7; i++) {
    const key = formatedWeekdays[i];
    const value = exceptions[i];

    result[key] = value;
  }

  return result;
};

// exceptions test it
module.exports = (defaultParams, exceptions) => {
  const { bulkOp, masterId, date } = defaultParams;

  const findQuery = find(masterId, date);

  const historyDate = dayjs().utc().toDate();
  const historyRecord = { user: 'server', status: 'unsuitable', date: historyDate };

  const formatedExceptions = formatWeekObjectForMongodb(exceptions);
  const pipeline = createPipeline(formatedExceptions, historyRecord);

  bulkOp.aggregationUpdate(findQuery, pipeline);
};
